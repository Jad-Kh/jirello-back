import { CalendarQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateCalendarRequest } from "./createCalendarRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { validTimezone, scopeAccess } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function createCalendarHandler(
    request: IRequest<CreateCalendarRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        if (!validTimezone(value.timezone)) {
            response.status(400).json({ ...CalendarErrorResponses.CALENDAR_TIMEZONE_IS_INVALID });
            return;
        }
        if (value.projectId && !value.communityId) {
            response
                .status(400)
                .json({ ...CalendarErrorResponses.PROJECT_CALENDARS_REQUIRE_THEIR_COMMUNITY_ID });
            return;
        }
        if (value.visibility === "members" && !value.communityId) {
            response.status(400).json({ ...CalendarErrorResponses.SHARED_CALENDARS_REQUIRE_A_COMMUNITY });
            return;
        }
        if (
            (value.communityId || value.projectId) &&
            !(await scopeAccess(request.userId!, value.communityId, value.projectId, true))
        ) {
            response.status(403).json({ ...CalendarErrorResponses.CALENDAR_CREATION_ACCESS_DENIED });
            return;
        }
        const calendar = await runInTransaction(async () => {
            if (value.isDefault) {
                await CalendarQueries.updateCalendarsQuery(
                    {
                        ownerId: request.userId!,
                        communityId: value.communityId,
                        projectId: value.projectId,
                        isDefault: true,
                    },
                    { $set: { isDefault: false } },
                    { session: getTransactionSession() },
                );
            }
            const saved = await CalendarQueries.createCalendarQuery({
                ...value,
                ownerId: request.userId!,
            });
            await enqueueRealtimeEvent({
                channels: [RealtimeChannels.user(request.userId!)],
                eventName: "calendar-created-v1",
                actorId: request.userId!,
                aggregate: { type: "calendar", id: saved.id, version: saved.version },
                data: { calendar: saved.toObject({ virtuals: true }) },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return saved;
        });
        request.responseModel = calendar;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
