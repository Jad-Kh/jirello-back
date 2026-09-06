import { TaskQueries } from "../../../database/queries/task.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateTaskRequest } from "./createTaskRequest.js";

import { ProjectQueries } from "../../../database/queries/project.js";
import { runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import {
    taskRequestHash,
    isDuplicateKeyError,
    findTaskByIdempotencyKey,
    visibleTask,
    taskContext,
    validateWorkShape,
    resolvedStatus,
    validateTaskRelations,
    requestSocketId,
} from "../../../services/task/taskService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TaskErrorResponses } from "../../../responses/errors/TaskErrorResponses.js";
import { TaskSuccessResponses } from "../../../responses/success/TaskSuccessResponses.js";

export async function createTaskHandler(
    request: IRequest<CreateTaskRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    let idempotencyKey: string | undefined;
    let requestHash: string | undefined;
    let projectId: string | undefined;
    try {
        const value = request.requestModel!;
        projectId = value.projectId;
        const suppliedKey = request.header("idempotency-key")?.trim();
        if (suppliedKey && (suppliedKey.length > 128 || !/^[\w.:+-]+$/.test(suppliedKey))) {
            response.status(400).json({
                ...TaskErrorResponses.IDEMPOTENCY_KEY_MUST_BE_AT_MOST_128_LETTERS_NUMBERS_DOTS_COLONS_PLUSES_UNDERSCORES_OR_HYPHENS,
            });
            return;
        }
        idempotencyKey = suppliedKey;
        requestHash = idempotencyKey ? taskRequestHash(value) : undefined;
        const context = await taskContext(request.userId!, value.projectId, [Permissions.CREATE_OWN]);
        if (!context) {
            response.status(403).json({ ...TaskErrorResponses.PROJECT_TASK_ACCESS_DENIED });
            return;
        }
        if (idempotencyKey) {
            const existing = await findTaskByIdempotencyKey(value.projectId, request.userId!, idempotencyKey);
            if (existing) {
                if (existing.requestHash !== requestHash) {
                    response.status(409).json({
                        ...TaskErrorResponses.THIS_IDEMPOTENCY_KEY_WAS_ALREADY_USED_WITH_A_DIFFERENT_TASK_REQUEST,
                    });
                    return;
                }
                response.setHeader("Idempotency-Replayed", "true");
                request.responseModel = visibleTask(existing);
                request.successResponse = TaskSuccessResponses.EXISTING_TASK_RETURNED;
                next();
                return;
            }
        }
        const memberIds = new Set([...context.community.ownerIds, ...context.community.userIds].map(String));
        if (
            value.assigneeIds.some((id: string) => !memberIds.has(id)) ||
            (value.reviewerId && !memberIds.has(value.reviewerId))
        ) {
            response.status(400).json({ ...TaskErrorResponses.TASK_USERS_MUST_BELONG_TO_THE_COMMUNITY });
            return;
        }
        const state = await resolvedStatus(
            value.projectId,
            context.community.id,
            value.typeKey,
            value.status,
        );
        value.status = state.status;
        const shapeError = await validateWorkShape(value.projectId, context.community.id, value);
        if (shapeError) {
            response.status(400).json({ code: 400, message: shapeError });
            return;
        }
        if (
            !(await validateTaskRelations(value.projectId, undefined, [
                value.parentId,
                ...value.dependencyIds,
                ...value.relatedTaskIds,
            ]))
        ) {
            response
                .status(400)
                .json({ ...TaskErrorResponses.TASK_RELATIONSHIPS_MUST_REFERENCE_TASKS_IN_THE_SAME_PROJECT });
            return;
        }
        const task = await runInTransaction(async () => {
            const saved = await TaskQueries.createTaskQuery({
                projectId: value.projectId,
                title: value.title,
                description: value.description,
                priority: value.priority,
                deadline: value.deadline,
                deadlineAt: value.deadline === "Unlimited" ? undefined : new Date(value.deadline),
                status: value.status,
                position: value.position,
                accomplished: state.done,
                users: {
                    createdBy: request.userId!,
                    reviewer: value.reviewerId ?? request.userId!,
                    userIds: value.assigneeIds,
                },
                typeKey: value.typeKey,
                customFields: value.customFields,
                parentId: value.parentId,
                dependencyIds: value.dependencyIds,
                relatedTaskIds: value.relatedTaskIds,
                tags: value.tags,
                startAt: value.startAt,
                estimatedMinutes: value.estimatedMinutes,
                milestone: value.milestone,
                recurrence: value.recurrence,
                audience: value.audience,
                idempotencyKey,
                requestHash,
            });
            await ProjectQueries.addTaskToProjectQuery(value.projectId, saved.id);
            await enqueueRealtimeEvent({
                channels: [
                    RealtimeChannels.project(value.projectId),
                    ...value.assigneeIds.slice(0, 99).map(RealtimeChannels.user),
                ],
                eventName: "task-created-v1",
                actorId: request.userId!,
                aggregate: { type: "task", id: saved.id, version: saved.version },
                data: { task: visibleTask(saved) },
                socketId: requestSocketId(request.header("x-pusher-socket-id")),
            });
            for (const recipientId of value.assigneeIds.filter((id: string) => id !== request.userId!)) {
                await createNotification({
                    recipientId,
                    actorId: request.userId!,
                    communityId: context.community.id,
                    projectId: value.projectId,
                    resourceType: "task",
                    resourceId: saved.id,
                    type: "task-assigned",
                    title: "Task assigned",
                    body: `You were assigned to ${saved.title}.`,
                });
            }
            return saved;
        });
        request.responseModel = visibleTask(task);
        next();
    } catch (error) {
        if (idempotencyKey && requestHash && projectId && isDuplicateKeyError(error)) {
            const existing = await findTaskByIdempotencyKey(projectId, request.userId!, idempotencyKey);
            if (existing?.requestHash === requestHash) {
                response.setHeader("Idempotency-Replayed", "true");
                request.responseModel = visibleTask(existing);
                request.successResponse = TaskSuccessResponses.EXISTING_TASK_RETURNED;
                next();
                return;
            }
            if (existing) {
                response.status(409).json({
                    ...TaskErrorResponses.THIS_IDEMPOTENCY_KEY_WAS_ALREADY_USED_WITH_A_DIFFERENT_TASK_REQUEST,
                });
                return;
            }
        }
        next(error);
    }
}
