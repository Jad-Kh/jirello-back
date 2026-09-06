import { TaskQueries } from "../../../database/queries/task.js";
import { decodePositionCursor, encodePositionCursor } from "../../../helpers/cursorPagination.js";
import type { IRequest } from "../../../helpers/api.js";
import { hasPermission, Permissions } from "../../../helpers/permissions.js";
import { taskContext } from "../../../services/task/taskService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import mongoose, { type QueryFilter } from "mongoose";
import type { ITask } from "../../../database/models/task/ITask.js";
import { TaskErrorResponses } from "../../../responses/errors/TaskErrorResponses.js";
import type { GetProjectTasksRequest } from "./getProjectTasksRequest.js";

export async function getProjectTasksHandler(
    request: IRequest<GetProjectTasksRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const cursor = value.cursor ? decodePositionCursor(value.cursor) : null;
        if (value.cursor && !cursor) {
            response.status(400).json({ ...TaskErrorResponses.VALIDATION_ERROR });
            return;
        }
        const context = await taskContext(request.userId!, value.projectId, [
            Permissions.READ_OWN,
            Permissions.READ_OTHER,
        ]);
        if (!context) {
            response.status(403).json({ ...TaskErrorResponses.PROJECT_TASK_ACCESS_DENIED });
            return;
        }
        const canReadOther = hasPermission(context.permissions, "tasks", [Permissions.READ_OTHER]);
        const accessFilter: QueryFilter<ITask> = !canReadOther
            ? {
                  $or: [
                      { "users.createdBy": request.userId! },
                      { "users.reviewer": request.userId! },
                      { "users.userIds": request.userId! },
                  ],
              }
            : {};
        const cursorFilter: QueryFilter<ITask> = cursor
            ? {
                  $or: [
                      { position: { $gt: cursor.position } },
                      { position: cursor.position, _id: { $gt: new mongoose.Types.ObjectId(cursor.id) } },
                  ],
              }
            : {};
        const filter: QueryFilter<ITask> = {
            projectId: value.projectId,
            ...(value.status ? { status: value.status } : {}),
            ...(value.search ? { $text: { $search: value.search } } : {}),
            $and: [accessFilter, cursorFilter],
        };
        const countFilter = { ...filter };
        delete countFilter.$and;
        countFilter.$and = [accessFilter];
        const [candidates, total] = await Promise.all([
            TaskQueries.getTasksQuery(filter)
                .sort({ position: 1, _id: 1 })
                .limit(value.limit + 1),
            TaskQueries.countTasksQuery(countFilter),
        ]);
        const hasMore = candidates.length > value.limit;
        const tasks = candidates.slice(0, value.limit);
        const last = tasks.at(-1);
        request.responseModel = {
            tasks,
            total,
            nextCursor: hasMore && last ? encodePositionCursor(last.position, last.id) : null,
        };
        next();
    } catch (error) {
        next(error);
    }
}
