import { CalendarEventQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateCalendarEventRequest } from "./updateCalendarEventRequest.js";
import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { communityAccess, isCommunityManager, projectAccess } from "../../../security/domainAccess.js";
import { eventChannels, validateEventInput } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function updateCalendarEventHandler(
    request: IRequest<UpdateCalendarEventRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await CalendarEventQueries.getCalendarEventByIdQuery(request.params.id);
        if (!current) {
            response.status(404).json({ ...CalendarErrorResponses.CALENDAR_EVENT_NOT_FOUND });
            return;
        }
        let canEdit = current.ownerId === request.userId! || current.organizerId === request.userId!;
        if (!canEdit && current.communityId) {
            const context = current.projectId
                ? await projectAccess(request.userId!, current.projectId, "meetings", [
                      Permissions.EDIT_OTHER,
                  ])
                : await communityAccess(request.userId!, current.communityId, "meetings", [
                      Permissions.EDIT_OTHER,
                  ]);
            canEdit = Boolean(context && isCommunityManager(context, request.userId!));
        }
        if (!canEdit) {
            response.status(403).json({ ...CalendarErrorResponses.CALENDAR_EVENT_UPDATE_ACCESS_DENIED });
            return;
        }
        const candidate = {
            ...current.toObject(),
            ...value,
            startAt: value.startAt ?? current.startAt,
            endAt: value.endAt ?? current.endAt,
            timezone: value.timezone ?? current.timezone,
            attendees: value.attendees ?? current.attendees,
        };
        const businessError = await validateEventInput(request.userId!, candidate);
        if (businessError) {
            response.status(400).json({ code: 400, message: businessError });
            return;
        }
        const { version, ...updates } = value;
        const previousChannels = eventChannels(current);
        const event = await runInTransaction(async () => {
            const updated = await CalendarEventQueries.updateCalendarEventQuery(
                { _id: current.id, version },
                {
                    $set: {
                        ...updates,
                        ...(updates.attendees
                            ? {
                                  attendees: updates.attendees.map((attendee: { userId?: string }) => ({
                                      ...attendee,
                                      response: "pending",
                                  })),
                              }
                            : {}),
                    },
                    $inc: { version: 1 },
                },
                { new: true, session: getTransactionSession() },
            );
            if (!updated) return null;
            await enqueueRealtimeEvent({
                channels: Array.from(new Set([...previousChannels, ...eventChannels(updated)])).slice(0, 100),
                eventName:
                    updates.startAt || updates.endAt
                        ? "calendar-event-moved-v1"
                        : "calendar-event-updated-v1",
                actorId: request.userId!,
                aggregate: { type: "calendar-event", id: updated.id, version: updated.version },
                data: {
                    event: updated.toObject({ virtuals: true }),
                    changedFields: Object.keys(request.body),
                },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
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
