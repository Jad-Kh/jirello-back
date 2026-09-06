import { CalendarEventQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateCalendarEventRequest } from "./createCalendarEventRequest.js";

import { runInTransaction } from "../../../database/transaction.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import { eventChannels, validateEventInput } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";

export async function createCalendarEventHandler(
    request: IRequest<CreateCalendarEventRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const businessError = await validateEventInput(request.userId!, value);
        if (businessError) {
            response.status(400).json({ code: 400, message: businessError });
            return;
        }
        const event = await runInTransaction(async () => {
            const saved = await CalendarEventQueries.createCalendarEventQuery({
                ...value,
                ownerId: request.userId!,
                organizerId: request.userId!,
                attendees: value.attendees.map((attendee: { userId?: string }) => ({
                    ...attendee,
                    response: "pending",
                })),
            });
            await enqueueRealtimeEvent({
                channels: eventChannels(saved),
                eventName: "calendar-event-created-v1",
                actorId: request.userId!,
                aggregate: { type: "calendar-event", id: saved.id, version: saved.version },
                data: { event: saved.toObject({ virtuals: true }) },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            for (const attendee of saved.attendees) {
                if (!attendee.userId || attendee.userId === request.userId!) continue;
                await createNotification({
                    recipientId: attendee.userId,
                    actorId: request.userId!,
                    communityId: saved.communityId,
                    projectId: saved.projectId,
                    resourceType: "calendar-event",
                    resourceId: saved.id,
                    type: "calendar-invitation",
                    title: "Calendar invitation",
                    body: `You were invited to ${saved.title}.`,
                });
            }
            return saved;
        });
        request.responseModel = event;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
