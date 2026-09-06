import { CalendarEventQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetCalendarAvailabilityRequest } from "./getCalendarAvailabilityRequest.js";

import { Permissions } from "../../../helpers/permissions.js";
import { communityAccess } from "../../../security/domainAccess.js";
import {
    expandCalendarEventsInWorker,
    recurrenceWorkerEvent,
} from "../../../services/calendar/recurrenceWorker.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function getCalendarAvailabilityHandler(
    request: IRequest<GetCalendarAvailabilityRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const userIds: string[] = Array.isArray(value.userIds)
            ? value.userIds
            : String(value.userIds).split(",").filter(Boolean);
        const from = new Date(value.from);
        const to = new Date(value.to);
        if (to <= from || to.getTime() - from.getTime() > 31 * 86_400_000) {
            response.status(400).json({
                ...CalendarErrorResponses.AVAILABILITY_RANGE_MUST_BE_POSITIVE_AND_NO_LONGER_THAN_31_DAYS,
            });
            return;
        }
        if (userIds.some((id) => id !== request.userId!)) {
            const context = value.communityId
                ? await communityAccess(request.userId!, value.communityId, "meetings", [
                      Permissions.READ_OTHER,
                  ])
                : undefined;
            const members = context
                ? new Set([...context.community.ownerIds, ...context.community.userIds].map(String))
                : new Set();
            if (!context || userIds.some((id) => !members.has(id))) {
                response.status(403).json({ ...CalendarErrorResponses.TEAM_AVAILABILITY_ACCESS_DENIED });
                return;
            }
        }
        const events = await CalendarEventQueries.getCalendarEventsQuery({
            status: { $ne: "cancelled" },
            availability: "busy",
            startAt: { $lt: to },
            $or: [{ ownerId: { $in: userIds } }, { "attendees.userId": { $in: userIds } }],
        });
        const occurrencesByEvent = await expandCalendarEventsInWorker(
            events.map((event) => recurrenceWorkerEvent(event)),
            from,
            to,
        );
        const busyByUser = Object.fromEntries(
            userIds.map((userId) => [
                userId,
                events
                    .flatMap((event, index) =>
                        event.ownerId === userId ||
                        event.attendees.some(
                            (attendee) => attendee.userId === userId && attendee.response !== "declined",
                        )
                            ? (occurrencesByEvent[index] ?? []).map(({ startAt, endAt }) => ({
                                  startAt,
                                  endAt,
                              }))
                            : [],
                    )
                    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime()),
            ]),
        );
        request.responseModel = { from, to, busyByUser };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
