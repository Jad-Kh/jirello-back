import { TaskQueries } from "../../../database/queries/task.js";

import { ProjectQueries } from "../../../database/queries/project.js";
import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { taskContext, requestSocketId } from "../../../services/task/taskService.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { TaskErrorResponses } from "../../../responses/errors/TaskErrorResponses.js";

export async function deleteTaskHandler(
    request: ExpressRequest<{ id: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        if (!/^[a-f\d]{24}$/i.test(request.params.id)) {
            response.status(400).json({ ...TaskErrorResponses.INVALID_TASK_ID });
            return;
        }
        const task = await TaskQueries.getTaskByIdQuery(request.params.id);
        const requiredPermission =
            task?.users?.createdBy === request.userId! ? Permissions.DELETE_OWN : Permissions.DELETE_OTHER;
        if (!task || !(await taskContext(request.userId!, task.projectId, [requiredPermission]))) {
            response.status(403).json({ ...TaskErrorResponses.PROJECT_TASK_ACCESS_DENIED });
            return;
        }
        await runInTransaction(async () => {
            await TaskQueries.deleteTaskQuery({ _id: task.id }, { session: getTransactionSession() });
            await ProjectQueries.removeTaskFromProjectQuery(task.projectId, task.id);
            await enqueueRealtimeEvent({
                channels: [
                    RealtimeChannels.project(task.projectId),
                    ...Array.from(new Set(task.users?.userIds ?? []))
                        .slice(0, 99)
                        .map(RealtimeChannels.user),
                ],
                eventName: "task-deleted-v1",
                actorId: request.userId!,
                aggregate: { type: "task", id: task.id, version: task.version + 1 },
                data: { taskId: task.id },
                socketId: requestSocketId(request.header("x-pusher-socket-id")),
            });
        });
        request.responseModel = { id: task.id };
        next();
    } catch (error) {
        next(error);
    }
}
