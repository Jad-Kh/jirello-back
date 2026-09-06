import { CalendarQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateCalendarRequest } from "./updateCalendarRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { validTimezone } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function updateCalendarHandler(
    request: IRequest<UpdateCalendarRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await CalendarQueries.getCalendarByIdQuery(request.params.id);
        if (!current || current.ownerId !== request.userId!) {
            response.status(403).json({ ...CalendarErrorResponses.ONLY_THE_CALENDAR_OWNER_CAN_UPDATE_IT });
            return;
        }
        if (value.timezone && !validTimezone(value.timezone)) {
            response.status(400).json({ ...CalendarErrorResponses.CALENDAR_TIMEZONE_IS_INVALID });
            return;
        }
        if (value.visibility === "members" && !current.communityId) {
            response
                .status(400)
                .json({ ...CalendarErrorResponses.PERSONAL_CALENDARS_CANNOT_BE_SHARED_WITH_MEMBERS });
            return;
        }
        const { version, ...updates } = value;
        const calendar = await runInTransaction(async () => {
            if (updates.isDefault) {
                await CalendarQueries.updateCalendarsQuery(
                    {
                        ownerId: request.userId!,
                        communityId: current.communityId,
                        projectId: current.projectId,
                        isDefault: true,
                        _id: { $ne: current.id },
                    },
                    { $set: { isDefault: false } },
                    { session: getTransactionSession() },
                );
            }
            const updated = await CalendarQueries.updateCalendarQuery(
                { _id: current.id, version },
                { $set: updates, $inc: { version: 1 } },
                { new: true, session: getTransactionSession() },
            );
            if (updated) {
                await enqueueRealtimeEvent({
                    channels: [RealtimeChannels.user(request.userId!)],
                    eventName: "calendar-updated-v1",
                    actorId: request.userId!,
                    aggregate: { type: "calendar", id: updated.id, version: updated.version },
                    data: { calendar: updated.toObject({ virtuals: true }) },
                    socketId: pusherSocketId(request.header("x-pusher-socket-id")),
                });
            }
            return updated;
        });
        if (!calendar) {
            response
                .status(409)
                .json({ ...CalendarErrorResponses.CALENDAR_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = calendar;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
