import { GuestAccessQueries } from "../../database/queries/portal.js";

import type { ITask } from "../../database/models/task/ITask.js";
export {
    objectId,
    deliverableAssetValidationScheme,
} from "../../validators/schemes/portalValidationSchemes.js";

export async function activeGuest(userId: string, projectId: string) {
    return GuestAccessQueries.getGuestAccessQuery({
        userId,
        projectId,
        status: "active",
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
    });
}
export function presentClientTask(task: ITask) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        typeKey: task.typeKey,
        customFields: task.customFields,
        status: task.status,
        priority: task.priority,
        startAt: task.startAt,
        deadlineAt: task.deadlineAt,
        tags: task.tags,
        milestone: task.milestone,
        accomplished: task.accomplished,
        version: task.version,
    };
}
