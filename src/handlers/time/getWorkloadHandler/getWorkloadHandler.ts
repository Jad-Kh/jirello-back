import { CalendarEventQueries } from "../../../database/queries/calendar.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetWorkloadRequest } from "./getWorkloadRequest.js";
import { TaskQueries } from "../../../database/queries/task.js";
import { MemberCapacityQueries, TimeEntryQueries } from "../../../database/queries/time.js";

import { Permissions } from "../../../helpers/permissions.js";
import { expandCalendarEvent } from "../../../services/calendar/recurrence.js";
import { communityAccess } from "../../../security/domainAccess.js";
import { availableMinutesInRange } from "../../../services/time/timeService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TimeErrorResponses } from "../../../responses/errors/TimeErrorResponses.js";

export async function getWorkloadHandler(
    request: IRequest<GetWorkloadRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await communityAccess(request.userId!, value.communityId, "users", [
            Permissions.READ_OTHER,
        ]);
        if (!context) {
            response.status(403).json({ ...TimeErrorResponses.WORKLOAD_ACCESS_DENIED });
            return;
        }
        const projectIds = context.community.projectIds.map(String);
        const memberIds = [...context.community.ownerIds, ...context.community.userIds].map(String);
        const from = new Date(value.from);
        const to = new Date(value.to);
        const [capacities, tasks, time, absences] = await Promise.all([
            MemberCapacityQueries.getMemberCapacitiesQuery({ communityId: value.communityId }),
            TaskQueries.getTasksQuery({
                projectId: { $in: projectIds },
                accomplished: false,
                deadlineAt: { $gte: value.from, $lt: value.to },
            }),
            TimeEntryQueries.getTimeEntriesQuery({
                communityId: value.communityId,
                startedAt: { $gte: value.from, $lt: value.to },
                endedAt: { $exists: true },
            }),
            CalendarEventQueries.getCalendarEventsQuery({
                ownerId: { $in: memberIds },
                kind: "out-of-office",
                status: { $ne: "cancelled" },
                startAt: { $lt: value.to },
                $or: [{ endAt: { $gt: value.from } }, { "recurrence.frequency": { $exists: true } }],
            }),
        ]);
        const workload = memberIds.map((userId) => {
            const configuredCapacity = capacities.find((candidate) => candidate.userId === userId);
            const absenceMinutes = absences
                .filter((event) => event.ownerId === userId)
                .flatMap((event) => expandCalendarEvent(event, from, to))
                .reduce(
                    (sum, occurrence) =>
                        sum + Math.ceil((occurrence.endAt.getTime() - occurrence.startAt.getTime()) / 60_000),
                    0,
                );
            const capacity = Math.max(
                0,
                availableMinutesInRange(configuredCapacity, from, to) - absenceMinutes,
            );
            const plannedMinutes = tasks
                .filter((task) => task.users?.userIds?.includes(userId))
                .reduce((sum, task) => sum + (task.estimatedMinutes ?? 0), 0);
            const trackedMinutes = time
                .filter((entry) => entry.userId === userId)
                .reduce((sum, entry) => sum + (entry.durationMinutes ?? 0), 0);
            return {
                userId,
                capacityMinutes: capacity,
                plannedMinutes,
                trackedMinutes,
                utilization: capacity ? plannedMinutes / capacity : null,
            };
        });
        request.responseModel = workload;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
