import { TimeEntryQueries } from "../../../database/queries/time.js";
import { decodeDateCursor, encodeDateCursor } from "../../../helpers/cursorPagination.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetTimeEntriesRequest } from "./getTimeEntriesRequest.js";

import { isCommunityManager } from "../../../security/domainAccess.js";
import { presentEntry, assertEntryScope } from "../../../services/time/timeService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TimeErrorResponses } from "../../../responses/errors/TimeErrorResponses.js";
import mongoose, { type QueryFilter } from "mongoose";
import type { ITimeEntry } from "../../../database/models/time/ITimeEntry.js";

export async function getTimeEntriesHandler(
    request: IRequest<GetTimeEntriesRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await assertEntryScope(
            request.userId!,
            value.communityId,
            value.projectId,
            value.taskId,
        );
        if (!context) {
            response.status(403).json({ ...TimeErrorResponses.TIME_ENTRY_ACCESS_DENIED });
            return;
        }
        const manager = isCommunityManager(context, request.userId!);
        const requestedUserId = value.userId ?? request.userId!;
        if (requestedUserId !== request.userId! && !manager) {
            response.status(403).json({ ...TimeErrorResponses.ONLY_MANAGERS_CAN_READ_ANOTHER_MEMBER_S_TIME });
            return;
        }
        const cursor = value.cursor ? decodeDateCursor(value.cursor) : null;
        if (value.cursor && !cursor) {
            response.status(400).json({ ...TimeErrorResponses.VALIDATION_ERROR });
            return;
        }
        const baseFilter: QueryFilter<ITimeEntry> = {
            communityId: value.communityId,
            userId: requestedUserId,
            startedAt: { $gte: value.from, $lt: value.to },
            ...(value.projectId ? { projectId: value.projectId } : {}),
            ...(value.taskId ? { taskId: value.taskId } : {}),
            ...(value.status ? { status: value.status } : {}),
        };
        const cursorDate = cursor ? new Date(cursor.createdAt) : null;
        const cursorFilter: QueryFilter<ITimeEntry> =
            cursorDate && cursor
                ? {
                      $or: [
                          { startedAt: { $lt: cursorDate } },
                          {
                              startedAt: cursorDate,
                              _id: { $lt: new mongoose.Types.ObjectId(cursor.id) },
                          },
                      ],
                  }
                : {};
        const [candidates, total] = await Promise.all([
            TimeEntryQueries.getTimeEntriesQuery({
                $and: [baseFilter, cursorFilter],
            })
                .sort({ startedAt: -1, _id: -1 })
                .limit(value.limit + 1),
            TimeEntryQueries.countTimeEntriesQuery(baseFilter),
        ]);
        const hasMore = candidates.length > value.limit;
        const entries = candidates.slice(0, value.limit);
        const last = entries.at(-1);
        request.responseModel = {
            entries: entries.map((entry) => presentEntry(entry, manager)),
            total,
            nextCursor: hasMore && last ? encodeDateCursor(last.startedAt, last.id) : null,
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
