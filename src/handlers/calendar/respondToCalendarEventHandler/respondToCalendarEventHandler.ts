import { CalendarEventQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { RespondToCalendarEventRequest } from "./respondToCalendarEventRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { eventChannels } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function respondToCalendarEventHandler(
    request: IRequest<RespondToCalendarEventRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await CalendarEventQueries.getCalendarEventQuery({
            _id: request.params.id,
            "attendees.userId": request.userId!,
        });
        if (!current) {
            response.status(403).json({ ...CalendarErrorResponses.CALENDAR_INVITATION_ACCESS_DENIED });
            return;
        }
        const attendees = current.attendees.map((attendee) =>
            attendee.userId === request.userId! ? { ...attendee, response: value.response } : attendee,
        );
        const event = await runInTransaction(async () => {
            const updated = await CalendarEventQueries.updateCalendarEventQuery(
                { _id: current.id, version: value.version },
                { $set: { attendees }, $inc: { version: 1 } },
                { new: true, session: getTransactionSession() },
            );
            if (updated) {
                await enqueueRealtimeEvent({
                    channels: eventChannels(updated),
                    eventName: "calendar-attendee-responded-v1",
                    actorId: request.userId!,
                    aggregate: { type: "calendar-event", id: updated.id, version: updated.version },
                    data: { eventId: updated.id, userId: request.userId!, response: value.response },
                    socketId: pusherSocketId(request.header("x-pusher-socket-id")),
                });
            }
            return updated;
        });
        if (!event) {
            response
                .status(409)
                .json({ ...CalendarErrorResponses.CALENDAR_EVENT_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = event;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
