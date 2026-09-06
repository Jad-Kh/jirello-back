import { CalendarQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetCalendarsRequest } from "./getCalendarsRequest.js";

import { scopeAccess } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { ICalendar } from "../../../database/models/calendar/ICalendar.js";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function getCalendarsHandler(
    request: IRequest<GetCalendarsRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        if (
            (value.communityId || value.projectId) &&
            !(await scopeAccess(request.userId!, value.communityId, value.projectId))
        ) {
            response.status(403).json({ ...CalendarErrorResponses.CALENDAR_COLLECTION_ACCESS_DENIED });
            return;
        }
        const filter: QueryFilter<ICalendar> = {
            archivedAt: { $exists: false },
            $or: [
                { ownerId: request.userId! },
                ...(value.communityId
                    ? [{ communityId: value.communityId, visibility: "members" as const }]
                    : []),
                ...(value.projectId ? [{ projectId: value.projectId, visibility: "members" as const }] : []),
            ],
        };
        const calendars = await CalendarQueries.getCalendarsQuery(filter).sort({ isDefault: -1, name: 1 });
        request.responseModel = calendars;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
