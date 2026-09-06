import { TimeEntryQueries } from "../../../database/queries/time.js";
import type { IRequest } from "../../../helpers/api.js";
import type { SubmitTimesheetRequest } from "./submitTimesheetRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { communityAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TimeErrorResponses } from "../../../responses/errors/TimeErrorResponses.js";

export async function submitTimesheetHandler(
    request: IRequest<SubmitTimesheetRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        if (!(await communityAccess(request.userId!, value.communityId, "tasks", [Permissions.READ_OWN]))) {
            response.status(403).json({ ...TimeErrorResponses.TIMESHEET_ACCESS_DENIED });
            return;
        }
        const result = await runInTransaction(async () => {
            const update = await TimeEntryQueries.updateTimeEntriesQuery(
                {
                    communityId: value.communityId,
                    userId: request.userId!,
                    status: { $in: ["draft", "rejected"] },
                    endedAt: { $exists: true },
                    startedAt: { $gte: value.from, $lt: value.to },
                },
                { $set: { status: "submitted" }, $inc: { version: 1 } },
                { session: getTransactionSession() },
            );
            await enqueueRealtimeEvent({
                channels: [
                    RealtimeChannels.user(request.userId!),
                    RealtimeChannels.community(value.communityId),
                ],
                eventName: "timesheet-submitted-v1",
                actorId: request.userId!,
                aggregate: { type: "timesheet", id: request.userId!, version: Date.now() },
                data: {
                    communityId: value.communityId,
                    from: value.from,
                    to: value.to,
                    submittedCount: update.modifiedCount,
                },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return update;
        });
        request.responseModel = { submittedCount: result.modifiedCount };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
