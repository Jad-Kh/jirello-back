import { TimeEntryQueries } from "../../../database/queries/time.js";
import type { IRequest } from "../../../helpers/api.js";
import type { ReviewTimeEntryRequest } from "./reviewTimeEntryRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { communityAccess, isCommunityManager } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TimeErrorResponses } from "../../../responses/errors/TimeErrorResponses.js";

export async function reviewTimeEntryHandler(
    request: IRequest<ReviewTimeEntryRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await TimeEntryQueries.getTimeEntryByIdQuery(request.params.id);
        const context = current
            ? await communityAccess(request.userId!, current.communityId, "tasks", [Permissions.EDIT_OTHER])
            : undefined;
        if (
            !current ||
            !context ||
            !isCommunityManager(context, request.userId!) ||
            current.status !== "submitted"
        ) {
            response.status(403).json({ ...TimeErrorResponses.TIMESHEET_REVIEW_ACCESS_DENIED });
            return;
        }
        const entry = await runInTransaction(async () => {
            const updated = await TimeEntryQueries.updateTimeEntryQuery(
                { _id: current.id, version: value.version, status: "submitted" },
                {
                    $set: {
                        status: value.decision,
                        reviewerId: request.userId!,
                        reviewedAt: new Date(),
                        rejectionReason: value.decision === "rejected" ? value.reason : undefined,
                    },
                    $inc: { version: 1 },
                },
                { new: true, session: getTransactionSession() },
            );
            if (updated) {
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.user(updated.userId),
                        RealtimeChannels.community(updated.communityId),
                    ],
                    eventName: "time-entry-reviewed-v1",
                    actorId: request.userId!,
                    aggregate: { type: "time-entry", id: updated.id, version: updated.version },
                    data: { entryId: updated.id, status: updated.status, reviewerId: request.userId! },
                    socketId: pusherSocketId(request.header("x-pusher-socket-id")),
                });
            }
            return updated;
        });
        if (!entry) {
            response
                .status(409)
                .json({ ...TimeErrorResponses.TIME_ENTRY_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = entry;
        request.successResponse = { code: 200, message: `Time entry ${value.decision}.` };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
