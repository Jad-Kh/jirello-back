import { ProjectFinanceQueries } from "../../database/queries/finance.js";
import { TaskQueries } from "../../database/queries/task.js";

import { Permissions } from "../../helpers/permissions.js";
import { communityAccess, projectAccess } from "../../security/domainAccess.js";
import type { Response as ExpressResponse } from "express";
import type { HydratedDocument } from "mongoose";
import type { IMemberCapacity } from "../../database/models/time/IMemberCapacity.js";
import type { ITimeEntry } from "../../database/models/time/ITimeEntry.js";
export {
    objectId,
    date,
    timeEntryValidationScheme,
    memberCapacityValidationScheme,
} from "../../validators/schemes/timeValidationSchemes.js";

export function validationError(response: ExpressResponse, error: Error) {
    response.status(400).json({ code: 400, message: error.message });
}
export function presentEntry(entry: HydratedDocument<ITimeEntry>, includeRates: boolean) {
    const presented = entry.toObject({ virtuals: true });
    if (!includeRates) {
        delete presented.billingRateCents;
        delete presented.costRateCents;
    }
    return presented;
}
export async function assertEntryScope(
    userId: string,
    communityId: string,
    projectId?: string,
    taskId?: string,
) {
    const context = projectId
        ? await projectAccess(userId, projectId, "tasks", [Permissions.READ_OWN, Permissions.READ_OTHER])
        : await communityAccess(userId, communityId, "tasks", [Permissions.READ_OWN, Permissions.READ_OTHER]);
    if (!context || context.community.id !== communityId) return undefined;
    if (taskId) {
        const task = await TaskQueries.getTaskQuery({ _id: taskId, ...(projectId ? { projectId } : {}) });
        if (!task || task.projectId !== projectId) return undefined;
    }
    return context;
}
export async function derivedRates(projectId: string | undefined, userId: string) {
    const finance = projectId ? await ProjectFinanceQueries.getProjectFinanceQuery({ projectId }) : undefined;
    const memberRate = finance?.memberRates.find((candidate) => candidate.userId === userId);
    return {
        currency: finance?.currency ?? "USD",
        billingRateCents: memberRate?.billingRateCents ?? finance?.defaultBillingRateCents,
        costRateCents: memberRate?.costRateCents ?? finance?.defaultCostRateCents,
    };
}
export function availableMinutesInRange(
    capacity: Pick<IMemberCapacity, "workingDays" | "dailyMinutes" | "overrides"> | null | undefined,
    from: Date,
    to: Date,
): number {
    const workingDays = new Set(capacity?.workingDays ?? [1, 2, 3, 4, 5]);
    const dailyMinutes = capacity?.dailyMinutes ?? 480;
    const overrides = new Map(
        (capacity?.overrides ?? []).map((override) => [override.date, override.availableMinutes]),
    );
    let available = 0;
    for (let cursor = new Date(from); cursor < to; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
        const dateKey = cursor.toISOString().slice(0, 10);
        if (overrides.has(dateKey)) available += overrides.get(dateKey) ?? 0;
        else if (workingDays.has(cursor.getUTCDay())) available += dailyMinutes;
    }
    return available;
}
