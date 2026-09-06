import { TaskQueries } from "../../database/queries/task.js";
import { WorkConfigurationQueries } from "../../database/queries/work.js";
import { createHash } from "node:crypto";
import type Joi from "joi";

import { CommunityQueries } from "../../database/queries/community.js";
import { ProjectQueries } from "../../database/queries/project.js";
import { UserQueries } from "../../database/queries/user.js";
import { hasPermission } from "../../helpers/permissions.js";
import { getUserEffectivePermissions } from "../../security/permissionSecurity.js";
import { isCommunityMember } from "../../security/resourceSecurity.js";
import type { HydratedDocument } from "mongoose";
import type { ITask } from "../../database/models/task/ITask.js";
import type { Permission } from "../../helpers/permissions.js";
export {
    objectId,
    createTaskValidationScheme,
    updateTaskValidationScheme,
    reorderTasksValidationScheme,
} from "../../validators/schemes/taskValidationSchemes.js";

type WorkShapeInput = {
    typeKey?: string;
    status?: string;
    customFields?: Record<string, unknown>;
};

export class TaskReorderConflict extends Error {}
export function taskRequestHash(value: unknown): string {
    return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
export function isDuplicateKeyError(error: unknown): boolean {
    return Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);
}
export async function findTaskByIdempotencyKey(projectId: string, userId: string, idempotencyKey: string) {
    return TaskQueries.getTaskQuery({
        projectId,
        "users.createdBy": userId,
        idempotencyKey,
    }).select("+idempotencyKey +requestHash");
}
export function visibleTask(task: HydratedDocument<ITask>): Record<string, unknown> {
    const value = task.toObject({ virtuals: true });
    delete value.idempotencyKey;
    delete value.requestHash;
    return value;
}
export function validate(schema: Joi.ObjectSchema, source: Record<string, unknown>) {
    return schema.validate(source, { abortEarly: false, convert: true, stripUnknown: true });
}
export async function taskContext(userId: string, projectId: string, required: readonly Permission[]) {
    const [project, user] = await Promise.all([
        ProjectQueries.getProjectByIdQuery(projectId),
        UserQueries.getUserByIdQuery(userId),
    ]);
    if (!project || !user) return undefined;
    const community = await CommunityQueries.getCommunityByIdQuery(project.communityId);
    if (!community || !isCommunityMember(community, user.id)) return undefined;
    const permissions = await getUserEffectivePermissions(user, community);
    if (!hasPermission(permissions, "tasks", required)) return undefined;
    return { project, community, user, permissions };
}
export const legacyStatuses = new Set(["todo", "in-progress", "blocked", "done"]);
export function customValueMatches(type: string, value: unknown, options: string[]): boolean {
    if (value === undefined || value === null) return true;
    if (type === "text" || type === "currency" || type === "user") return typeof value === "string";
    if (type === "number") return typeof value === "number" && Number.isFinite(value);
    if (type === "boolean") return typeof value === "boolean";
    if (type === "date") return typeof value === "string" && !Number.isNaN(Date.parse(value));
    if (type === "select") return typeof value === "string" && options.includes(value);
    if (type === "multi-select") {
        return (
            Array.isArray(value) && value.every((item) => typeof item === "string" && options.includes(item))
        );
    }
    return false;
}
export async function validateWorkShape(
    projectId: string,
    communityId: string,
    input: WorkShapeInput,
    current?: Pick<ITask, "typeKey" | "status">,
): Promise<string | undefined> {
    const typeKey = input.typeKey ?? current?.typeKey ?? "task";
    const configuration = await WorkConfigurationQueries.getWorkConfigurationQuery({
        communityId,
        key: typeKey,
        archivedAt: { $exists: false },
        $or: [{ projectId }, { projectId: { $exists: false } }],
    }).sort({ projectId: -1 });
    if (!configuration) {
        if (typeKey !== "task") return `Unknown work type '${typeKey}'.`;
        if (input.status && !legacyStatuses.has(input.status)) return `Unknown status '${input.status}'.`;
        return undefined;
    }
    const status = input.status ?? current?.status ?? configuration.statuses[0]?.key;
    if (!configuration.statuses.some((candidate) => candidate.key === status))
        return `Status '${status}' is not valid for '${typeKey}'.`;
    if (current && input.status && input.status !== current.status && configuration.transitions.length) {
        if (
            !configuration.transitions.some(
                (transition) => transition.from === current.status && transition.to === input.status,
            )
        ) {
            return `Transition from '${current.status}' to '${input.status}' is not allowed.`;
        }
    }
    const customFields = input.customFields ?? {};
    const declared = new Set(configuration.fields.map((field) => field.key));
    const unknown = Object.keys(customFields).find((field) => !declared.has(field));
    if (unknown) return `Custom field '${unknown}' is not declared for '${typeKey}'.`;
    for (const field of configuration.fields) {
        const value = customFields[field.key];
        if (field.required && (value === undefined || value === null || value === ""))
            return `Custom field '${field.key}' is required.`;
        if (!customValueMatches(field.type, value, field.options))
            return `Custom field '${field.key}' has an invalid value.`;
    }
    return undefined;
}
export async function resolvedStatus(
    projectId: string,
    communityId: string,
    typeKey: string,
    status?: string,
): Promise<{ status: string; done: boolean }> {
    const configuration = await WorkConfigurationQueries.getWorkConfigurationQuery({
        communityId,
        key: typeKey,
        archivedAt: { $exists: false },
        $or: [{ projectId }, { projectId: { $exists: false } }],
    }).sort({ projectId: -1 });
    const resolved =
        status ?? configuration?.statuses.sort((a, b) => a.position - b.position)[0]?.key ?? "todo";
    return {
        status: resolved,
        done: configuration
            ? configuration.statuses.some(
                  (candidate) => candidate.key === resolved && candidate.category === "done",
              )
            : resolved === "done",
    };
}
export function nextRecurringDate(date: Date, recurrence: NonNullable<ITask["recurrence"]>): Date {
    const next = new Date(date);
    if (recurrence.frequency === "daily") next.setUTCDate(next.getUTCDate() + recurrence.interval);
    if (recurrence.frequency === "weekly") next.setUTCDate(next.getUTCDate() + recurrence.interval * 7);
    if (recurrence.frequency === "monthly") {
        const day = next.getUTCDate();
        next.setUTCDate(1);
        next.setUTCMonth(next.getUTCMonth() + recurrence.interval);
        const lastDay = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate();
        next.setUTCDate(Math.min(day, lastDay));
    }
    return next;
}
export async function validateTaskRelations(
    projectId: string,
    taskId: string | undefined,
    ids: Array<string | null | undefined>,
): Promise<boolean> {
    const relationIds = Array.from(new Set(ids.filter((id) => Boolean(id))));
    if (taskId && relationIds.includes(taskId)) return false;
    if (!relationIds.length) return true;
    return (
        (await TaskQueries.countTasksQuery({ _id: { $in: relationIds }, projectId })) === relationIds.length
    );
}
export async function introducesDependencyCycle(
    projectId: string,
    taskId: string,
    dependencyIds: string[],
): Promise<boolean> {
    const pending = [...dependencyIds];
    const visited = new Set();
    while (pending.length && visited.size < 1000) {
        const id = pending.shift();
        if (id === taskId) return true;
        if (visited.has(id)) continue;
        visited.add(id);
        const dependency = await TaskQueries.getTaskQuery({ _id: id, projectId }).select("dependencyIds");
        if (dependency) pending.push(...dependency.dependencyIds);
    }
    return false;
}
export async function introducesParentCycle(
    projectId: string,
    taskId: string,
    parentId?: string | null,
): Promise<boolean> {
    let candidate = parentId;
    const visited = new Set();
    while (candidate && visited.size < 1000) {
        if (candidate === taskId) return true;
        if (visited.has(candidate)) return true;
        visited.add(candidate);
        const parent = await TaskQueries.getTaskQuery({ _id: candidate, projectId }).select("parentId");
        candidate = parent?.parentId;
    }
    return false;
}
export function requestSocketId(value: unknown): string | undefined {
    const socketId = typeof value === "string" ? value : undefined;
    return socketId && /^\d+\.\d+$/.test(socketId) ? socketId : undefined;
}
