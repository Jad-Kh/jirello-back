import { TimeEntryQueries } from "../../../database/queries/time.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateTimeEntryRequest } from "./createTimeEntryRequest.js";

import { runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { isCommunityManager } from "../../../security/domainAccess.js";
import { presentEntry, assertEntryScope, derivedRates } from "../../../services/time/timeService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TimeErrorResponses } from "../../../responses/errors/TimeErrorResponses.js";

export async function createTimeEntryHandler(
    request: IRequest<CreateTimeEntryRequest, "">,
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
        const startedAt = new Date(value.startedAt);
        const endedAt = value.endedAt
            ? new Date(value.endedAt)
            : value.durationMinutes !== undefined
              ? new Date(startedAt.getTime() + value.durationMinutes * 60_000)
              : undefined;
        if (endedAt && endedAt <= startedAt) {
            response.status(400).json({ ...TimeErrorResponses.TIME_ENTRY_END_MUST_BE_AFTER_ITS_START });
            return;
        }
        if (
            !endedAt &&
            (await TimeEntryQueries.timeEntryExistsQuery({
                userId: request.userId!,
                endedAt: { $exists: false },
            }))
        ) {
            response
                .status(409)
                .json({ ...TimeErrorResponses.STOP_THE_ACTIVE_TIMER_BEFORE_STARTING_ANOTHER_ONE });
            return;
        }
        const rates = await derivedRates(value.projectId, request.userId!);
        const entry = await runInTransaction(async () => {
            const saved = await TimeEntryQueries.createTimeEntryQuery({
                ...value,
                userId: request.userId!,
                startedAt,
                endedAt,
                durationMinutes: endedAt
                    ? Math.ceil((endedAt.getTime() - startedAt.getTime()) / 60_000)
                    : undefined,
                ...rates,
            });
            await enqueueRealtimeEvent({
                channels: [
                    RealtimeChannels.user(request.userId!),
                    RealtimeChannels.community(value.communityId),
                ],
                eventName: "time-entry-created-v1",
                actorId: request.userId!,
                aggregate: { type: "time-entry", id: saved.id, version: saved.version },
                data: { entry: saved.toObject({ virtuals: true }) },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return saved;
        });
        request.responseModel = presentEntry(entry, isCommunityManager(context, request.userId!));
        request.successResponse = { code: 201, message: endedAt ? "Time entry created." : "Timer started." };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
