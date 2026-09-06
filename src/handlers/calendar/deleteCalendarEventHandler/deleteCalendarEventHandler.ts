import { CalendarEventQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { DeleteCalendarEventRequest } from "./deleteCalendarEventRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { eventChannels } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function deleteCalendarEventHandler(
    request: IRequest<DeleteCalendarEventRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await CalendarEventQueries.getCalendarEventByIdQuery(request.params.id);
        if (!current || (current.ownerId !== request.userId! && current.organizerId !== request.userId!)) {
            response.status(403).json({ ...CalendarErrorResponses.CALENDAR_EVENT_DELETION_ACCESS_DENIED });
            return;
        }
        const deleted = await runInTransaction(async () => {
            const removed = await CalendarEventQueries.deleteCalendarEventQuery(
                { _id: current.id, version: value.version },
                { session: getTransactionSession() },
            );
            if (removed) {
                await enqueueRealtimeEvent({
                    channels: eventChannels(removed),
                    eventName: "calendar-event-deleted-v1",
                    actorId: request.userId!,
                    aggregate: { type: "calendar-event", id: removed.id, version: removed.version + 1 },
                    data: { eventId: removed.id },
                    socketId: pusherSocketId(request.header("x-pusher-socket-id")),
                });
            }
            return removed;
        });
        if (!deleted) {
            response
                .status(409)
                .json({ ...CalendarErrorResponses.CALENDAR_EVENT_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = { id: deleted.id };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
