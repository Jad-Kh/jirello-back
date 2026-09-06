import { TimeEntryQueries } from "../../../database/queries/time.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateTimeEntryRequest } from "./updateTimeEntryRequest.js";
import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { communityAccess, isCommunityManager } from "../../../security/domainAccess.js";
import { presentEntry } from "../../../services/time/timeService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TimeErrorResponses } from "../../../responses/errors/TimeErrorResponses.js";

export async function updateTimeEntryHandler(
    request: IRequest<UpdateTimeEntryRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await TimeEntryQueries.getTimeEntryByIdQuery(request.params.id);
        if (!current || current.userId !== request.userId! || current.status === "approved") {
            response.status(403).json({ ...TimeErrorResponses.TIME_ENTRY_CANNOT_BE_EDITED });
            return;
        }
        const { version, ...updates } = value;
        const startedAt = updates.startedAt ? new Date(updates.startedAt) : current.startedAt;
        const endedAt = updates.endedAt
            ? new Date(updates.endedAt)
            : updates.durationMinutes !== undefined
              ? new Date(startedAt.getTime() + updates.durationMinutes * 60_000)
              : current.endedAt;
        if (endedAt && endedAt <= startedAt) {
            response.status(400).json({ ...TimeErrorResponses.TIME_ENTRY_END_MUST_BE_AFTER_ITS_START });
            return;
        }
        const entry = await runInTransaction(async () => {
            const updated = await TimeEntryQueries.updateTimeEntryQuery(
                { _id: current.id, version },
                {
                    $set: {
                        ...updates,
                        startedAt,
                        endedAt,
                        ...(endedAt
                            ? {
                                  durationMinutes: Math.ceil(
                                      (endedAt.getTime() - startedAt.getTime()) / 60_000,
                                  ),
                              }
                            : {}),
                        status: "draft",
                    },
                    $inc: { version: 1 },
                },
                { new: true, session: getTransactionSession() },
            );
            if (updated) {
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.user(request.userId!),
                        RealtimeChannels.community(updated.communityId),
                    ],
                    eventName: endedAt && !current.endedAt ? "timer-stopped-v1" : "time-entry-updated-v1",
                    actorId: request.userId!,
                    aggregate: { type: "time-entry", id: updated.id, version: updated.version },
                    data: { entry: presentEntry(updated, false) },
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
        const context = await communityAccess(request.userId!, current.communityId, "tasks", [
            Permissions.READ_OWN,
        ]);
        request.responseModel = presentEntry(
            entry,
            Boolean(context && isCommunityManager(context, request.userId!)),
        );
        request.successResponse = {
            code: 200,
            message: endedAt && !current.endedAt ? "Timer stopped." : "Time entry updated.",
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
