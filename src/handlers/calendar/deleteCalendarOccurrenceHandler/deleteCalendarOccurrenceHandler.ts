import { CalendarEventQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { DeleteCalendarOccurrenceRequest } from "./deleteCalendarOccurrenceRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { eventChannels } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function deleteCalendarOccurrenceHandler(
    request: IRequest<DeleteCalendarOccurrenceRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await CalendarEventQueries.getCalendarEventByIdQuery(request.params.id);
        if (
            !current?.recurrence ||
            (current.ownerId !== request.userId! && current.organizerId !== request.userId!)
        ) {
            response
                .status(403)
                .json({ ...CalendarErrorResponses.RECURRING_OCCURRENCE_DELETION_ACCESS_DENIED });
            return;
        }
        const occurrenceStart = new Date(value.occurrenceStart);
        const series = await runInTransaction(async () => {
            const updated = await CalendarEventQueries.updateCalendarEventQuery(
                { _id: current.id, version: value.version },
                { $addToSet: { "recurrence.excludedDates": occurrenceStart }, $inc: { version: 1 } },
                { new: true, session: getTransactionSession() },
            );
            if (updated) {
                await enqueueRealtimeEvent({
                    channels: eventChannels(current),
                    eventName: "calendar-occurrence-deleted-v1",
                    actorId: request.userId!,
                    aggregate: { type: "calendar-event", id: current.id, version: updated.version },
                    data: { seriesId: current.id, occurrenceStart: occurrenceStart.toISOString() },
                    socketId: pusherSocketId(request.header("x-pusher-socket-id")),
                });
            }
            return updated;
        });
        if (!series) {
            response
                .status(409)
                .json({ ...CalendarErrorResponses.CALENDAR_SERIES_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = { seriesId: series.id, occurrenceStart };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
