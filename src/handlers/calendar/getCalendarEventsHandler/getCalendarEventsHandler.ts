import { CalendarEventQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetCalendarEventsRequest } from "./getCalendarEventsRequest.js";
import { TaskQueries } from "../../../database/queries/task.js";
import { performance } from "node:perf_hooks";

import { logger } from "../../../helpers/logger.js";
import { realtimeDocument } from "../../../realtime/events.js";
import {
    expandCalendarEventsInWorker,
    recurrenceWorkerEvent,
} from "../../../services/calendar/recurrenceWorker.js";
import { scopeAccess } from "../../../services/calendar/calendarService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { ICalendarEvent } from "../../../database/models/calendar/ICalendarEvent.js";
import { CalendarErrorResponses } from "../../../responses/errors/CalendarErrorResponses.js";

export async function getCalendarEventsHandler(
    request: IRequest<GetCalendarEventsRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    const endpointStartedAt = performance.now();
    try {
        const value = request.requestModel!;
        const from = new Date(value.from);
        const to = new Date(value.to);
        if (to <= from || to.getTime() - from.getTime() > 366 * 86_400_000) {
            response.status(400).json({
                ...CalendarErrorResponses.CALENDAR_RANGE_MUST_BE_POSITIVE_AND_NO_LONGER_THAN_366_DAYS,
            });
            return;
        }
        if (
            (value.communityId || value.projectId) &&
            !(await scopeAccess(request.userId!, value.communityId, value.projectId))
        ) {
            response.status(403).json({ ...CalendarErrorResponses.CALENDAR_SCOPE_ACCESS_DENIED });
            return;
        }
        const eventFilter: QueryFilter<ICalendarEvent> = {
            startAt: { $lt: to },
            $or: [
                { endAt: { $gt: from } },
                { "recurrence.until": { $gte: from } },
                { "recurrence.count": { $exists: true } },
                {
                    "recurrence.frequency": { $exists: true },
                    "recurrence.until": { $exists: false },
                    "recurrence.count": { $exists: false },
                },
            ],
            ...(value.communityId ? { communityId: value.communityId } : {}),
            ...(value.projectId ? { projectId: value.projectId } : {}),
            ...(value.calendarId ? { calendarId: value.calendarId } : {}),
            $and: [
                {
                    $or: [
                        { ownerId: request.userId! },
                        { "attendees.userId": request.userId! },
                        ...(value.communityId
                            ? [{ communityId: value.communityId, visibility: "community" as const }]
                            : []),
                        ...(value.projectId
                            ? [{ projectId: value.projectId, visibility: "project" as const }]
                            : []),
                    ],
                },
            ],
        };
        const databaseStartedAt = performance.now();
        const [events, taskDeadlines] = await Promise.all([
            CalendarEventQueries.getCalendarEventsQuery(eventFilter).sort({ startAt: 1 }).exec(),
            value.includeTaskDeadlines
                ? TaskQueries.getTasksQuery({
                      "users.userIds": request.userId!,
                      deadlineAt: { $gte: from, $lt: to },
                      ...(value.projectId ? { projectId: value.projectId } : {}),
                  })
                      .sort({ deadlineAt: 1 })
                      .exec()
                : Promise.resolve([]),
        ]);
        const databaseMs = performance.now() - databaseStartedAt;
        const workerStartedAt = performance.now();
        const occurrencesByEvent = await expandCalendarEventsInWorker(
            events.map((event) => recurrenceWorkerEvent(event)),
            from,
            to,
        );
        const workerMs = performance.now() - workerStartedAt;
        const expanded = events.flatMap((event, index) =>
            occurrencesByEvent[index].map((occurrence) => ({
                event: realtimeDocument(event),
                occurrence,
            })),
        );
        logger.info(
            {
                requestId: request.id,
                endpoint: "GET /calendar/events",
                eventCount: events.length,
                occurrenceCount: expanded.length,
                timing: {
                    databaseMs: Number(databaseMs.toFixed(2)),
                    workerMs: Number(workerMs.toFixed(2)),
                    totalMs: Number((performance.now() - endpointStartedAt).toFixed(2)),
                },
            },
            "Calendar event expansion timing",
        );
        request.responseModel = {
            events: expanded,
            taskDeadlines: taskDeadlines.map((task) => ({
                occurrenceId: `task:${task.id}:${task.deadlineAt!.toISOString()}`,
                source: "task",
                taskId: task.id,
                projectId: task.projectId,
                title: task.title,
                startAt: task.startAt ?? task.deadlineAt!,
                endAt: task.deadlineAt!,
                allDay: true,
                color: undefined,
            })),
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
