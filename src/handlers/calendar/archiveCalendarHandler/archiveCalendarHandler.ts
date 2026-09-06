import type { Response as ExpressResponseHandler, NextFunction } from "express";
import { CalendarQueries } from "../../../database/queries/calendar.js";
import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import type { IRequest } from "../../../helpers/api.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";
import type { ArchiveCalendarRequest } from "./archiveCalendarRequest.js";

export async function archiveCalendarHandler(
    request: IRequest<ArchiveCalendarRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const calendar = await runInTransaction(async () => {
            const updated = await CalendarQueries.updateCalendarQuery(
                { _id: request.params.id, ownerId: request.userId!, version: value.version },
                { $set: { archivedAt: new Date(), isDefault: false }, $inc: { version: 1 } },
                { new: true, session: getTransactionSession() },
            );
            if (updated) {
                await enqueueRealtimeEvent({
                    channels: [RealtimeChannels.user(request.userId!)],
                    eventName: "calendar-archived-v1",
                    actorId: request.userId!,
                    aggregate: { type: "calendar", id: updated.id, version: updated.version },
                    data: { calendarId: updated.id },
                    socketId: pusherSocketId(request.header("x-pusher-socket-id")),
                });
            }
            return updated;
        });
        if (!calendar) {
            response
                .status(409)
                .json({ ...CalendarErrorResponses.CALENDAR_CHANGED_ELSEWHERE_OR_ACCESS_WAS_DENIED });
            return;
        }
        request.responseModel = { id: calendar.id };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
