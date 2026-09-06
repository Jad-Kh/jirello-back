import { CalendarEventQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateCalendarOccurrenceRequest } from "./updateCalendarOccurrenceRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { expandCalendarEvent } from "../../../services/calendar/recurrence.js";
import { eventChannels } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function updateCalendarOccurrenceHandler(
    request: IRequest<UpdateCalendarOccurrenceRequest, "">,
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
                .json({ ...CalendarErrorResponses.RECURRING_OCCURRENCE_UPDATE_ACCESS_DENIED });
            return;
        }
        const occurrenceStart = new Date(value.occurrenceStart);
        const exists = expandCalendarEvent(
            current,
            new Date(occurrenceStart.getTime() - 1000),
            new Date(occurrenceStart.getTime() + 1000),
            1,
        ).some((occurrence) => occurrence.startAt.getTime() === occurrenceStart.getTime());
        if (!exists) {
            response.status(404).json({ ...CalendarErrorResponses.RECURRING_OCCURRENCE_NOT_FOUND });
            return;
        }
        if (new Date(value.endAt) <= new Date(value.startAt)) {
            response
                .status(400)
                .json({ ...CalendarErrorResponses.CALENDAR_OCCURRENCE_END_MUST_BE_AFTER_ITS_START });
            return;
        }
        const result = await runInTransaction(async () => {
            const series = await CalendarEventQueries.updateCalendarEventQuery(
                { _id: current.id, version: value.version },
                { $addToSet: { "recurrence.excludedDates": occurrenceStart }, $inc: { version: 1 } },
                { new: true, session: getTransactionSession() },
            );
            if (!series) return undefined;
            const override = await CalendarEventQueries.createCalendarEventQuery({
                ownerId: current.ownerId,
                calendarId: current.calendarId,
                organizerId: current.organizerId,
                communityId: current.communityId,
                projectId: current.projectId,
                taskId: current.taskId,
                seriesId: current.id,
                originalStartAt: occurrenceStart,
                kind: current.kind,
                title: value.title ?? current.title,
                description: value.description ?? current.description,
                startAt: value.startAt,
                endAt: value.endAt,
                allDay: current.allDay,
                timezone: current.timezone,
                location: value.location ?? current.location,
                conferenceUrl: value.conferenceUrl ?? current.conferenceUrl,
                color: current.color,
                visibility: current.visibility,
                availability: current.availability,
                status: current.status,
                attendees: current.attendees,
                reminders: current.reminders,
            });
            await enqueueRealtimeEvent({
                channels: eventChannels(current),
                eventName: "calendar-occurrence-updated-v1",
                actorId: request.userId!,
                aggregate: { type: "calendar-event", id: current.id, version: series.version },
                data: {
                    seriesId: current.id,
                    occurrenceStart: occurrenceStart.toISOString(),
                    override: override.toObject({ virtuals: true }),
                },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return { series, override };
        });
        if (!result) {
            response
                .status(409)
                .json({ ...CalendarErrorResponses.CALENDAR_SERIES_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = result;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
