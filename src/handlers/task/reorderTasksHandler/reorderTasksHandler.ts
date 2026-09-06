import { TaskQueries } from "../../../database/queries/task.js";
import type { IRequest } from "../../../helpers/api.js";
import type { ReorderTasksRequest } from "./reorderTasksRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { hasPermission, Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { TaskReorderConflict, taskContext, requestSocketId } from "../../../services/task/taskService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TaskErrorResponses } from "../../../responses/errors/TaskErrorResponses.js";

export async function reorderTasksHandler(
    request: IRequest<ReorderTasksRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await taskContext(request.userId!, value.projectId, [
            Permissions.EDIT_OWN,
            Permissions.EDIT_OTHER,
        ]);
        const tasks = context
            ? await TaskQueries.getTasksQuery({
                  _id: { $in: value.changes.map((change: { id: string }) => change.id) },
                  projectId: value.projectId,
              })
            : [];
        if (!context || tasks.length !== value.changes.length) {
            response.status(403).json({ ...TaskErrorResponses.TASK_REORDER_ACCESS_DENIED });
            return;
        }
        const canEditOwn = hasPermission(context.permissions, "tasks", [Permissions.EDIT_OWN]);
        const canEditOther = hasPermission(context.permissions, "tasks", [Permissions.EDIT_OTHER]);
        if (tasks.some((task) => (task.users?.createdBy === request.userId! ? !canEditOwn : !canEditOther))) {
            response.status(403).json({ ...TaskErrorResponses.TASK_REORDER_ACCESS_DENIED });
            return;
        }
        try {
            const updatedTasks = await runInTransaction(async () => {
                const updated = [];
                for (const change of value.changes) {
                    const task = await TaskQueries.updateTaskQuery(
                        { _id: change.id, projectId: value.projectId, version: change.version },
                        {
                            $set: {
                                status: change.status,
                                position: change.position,
                                accomplished: change.status === "done",
                            },
                            $inc: { version: 1 },
                        },
                        { new: true, session: getTransactionSession() },
                    );
                    if (!task) throw new TaskReorderConflict();
                    updated.push(task);
                }
                const assigneeIds = Array.from(
                    new Set(updated.flatMap((task) => task.users?.userIds ?? [])),
                ).slice(0, 99);
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.project(value.projectId),
                        ...assigneeIds.map(RealtimeChannels.user),
                    ],
                    eventName: "tasks-reordered-v1",
                    actorId: request.userId!,
                    aggregate: { type: "project-tasks", id: value.projectId, version: Date.now() },
                    data: {
                        changes: updated.map((task) => ({
                            id: task.id,
                            status: task.status,
                            position: task.position,
                            version: task.version,
                        })),
                    },
                    socketId: requestSocketId(request.header("x-pusher-socket-id")),
                });
                return updated;
            });
            request.responseModel = updatedTasks;
            next();
        } catch (error) {
            if (error instanceof TaskReorderConflict) {
                response
                    .status(409)
                    .json({ ...TaskErrorResponses.A_TASK_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
                return;
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
}
