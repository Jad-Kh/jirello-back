import { CalendarQueries } from "../../database/queries/calendar.js";
import { TaskQueries } from "../../database/queries/task.js";
import { UserQueries } from "../../database/queries/user.js";

import { Permissions } from "../../helpers/permissions.js";
import { RealtimeChannels } from "../../realtime/channels.js";
import { communityAccess, projectAccess } from "../../security/domainAccess.js";
import type { Response as ExpressResponse } from "express";
import type { ICalendarEvent } from "../../database/models/calendar/ICalendarEvent.js";
export {
    objectId,
    isoDate,
    calendarAttendeeValidationScheme,
    calendarRecurrenceValidationScheme,
    calendarEventValidationScheme,
} from "../../validators/schemes/calendarValidationSchemes.js";

type CalendarEventInput = {
    calendarId?: string;
    communityId?: string;
    projectId?: string;
    taskId?: string;
    startAt: string | Date;
    endAt: string | Date;
    timezone: string;
    visibility: ICalendarEvent["visibility"];
    attendees?: Array<{ userId?: string }>;
};

export function invalid(response: ExpressResponse, error: Error) {
    response.status(400).json({ code: 400, message: error.message });
}
export function validTimezone(timezone: string): boolean {
    try {
        new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
        return true;
    } catch {
        return false;
    }
}
export function eventChannels(
    event: Pick<ICalendarEvent, "ownerId" | "attendees" | "visibility" | "projectId" | "communityId">,
): string[] {
    const channels = [RealtimeChannels.user(event.ownerId)];
    for (const attendee of event.attendees)
        if (attendee.userId) channels.push(RealtimeChannels.user(attendee.userId));
    if (event.visibility === "project" && event.projectId)
        channels.push(RealtimeChannels.project(event.projectId));
    if (event.visibility === "community" && event.communityId)
        channels.push(RealtimeChannels.community(event.communityId));
    return Array.from(new Set(channels)).slice(0, 100);
}
export async function scopeAccess(userId: string, communityId?: string, projectId?: string, write = false) {
    if (projectId) {
        const context = await projectAccess(userId, projectId, "meetings", [
            write ? Permissions.CREATE_OWN : Permissions.READ_OWN,
            write ? Permissions.CREATE_OTHER : Permissions.READ_OTHER,
        ]);
        return context && (!communityId || context.community.id === communityId) ? context : undefined;
    }
    if (communityId) {
        return communityAccess(userId, communityId, "meetings", [
            write ? Permissions.CREATE_OWN : Permissions.READ_OWN,
            write ? Permissions.CREATE_OTHER : Permissions.READ_OTHER,
        ]);
    }
    return { personal: true };
}
export async function validateEventInput(
    userId: string,
    value: CalendarEventInput,
): Promise<string | undefined> {
    const start = new Date(value.startAt);
    const end = new Date(value.endAt);
    if (end <= start) return "Calendar event end must be after its start.";
    if (end.getTime() - start.getTime() > 366 * 86_400_000)
        return "A calendar event cannot be longer than 366 days.";
    if (!validTimezone(value.timezone)) return "Calendar timezone is invalid.";
    if (value.projectId && !value.communityId) return "Project calendar events require their community ID.";
    if (value.visibility === "project" && !value.projectId) return "Project visibility requires a project.";
    if (value.visibility === "community" && !value.communityId)
        return "Community visibility requires a community.";
    if (
        !(await scopeAccess(
            userId,
            value.communityId,
            value.projectId,
            Boolean(value.communityId || value.projectId),
        ))
    ) {
        return "Calendar scope access denied.";
    }
    if (value.calendarId) {
        const calendar = await CalendarQueries.getCalendarQuery({
            _id: value.calendarId,
            archivedAt: { $exists: false },
        });
        if (!calendar) return "Calendar does not exist.";
        const canUse =
            calendar.ownerId === userId ||
            (calendar.visibility === "members" &&
                calendar.communityId === value.communityId &&
                calendar.projectId === value.projectId);
        if (!canUse) return "Calendar access denied.";
    }
    if (value.taskId) {
        const task = await TaskQueries.getTaskByIdQuery(value.taskId);
        if (!task || (value.projectId && task.projectId !== value.projectId))
            return "Calendar task must belong to the selected project.";
    }
    const userIds = (value.attendees ?? []).flatMap((attendee) => (attendee.userId ? [attendee.userId] : []));
    if (
        userIds.length &&
        (await UserQueries.countUsersQuery({ _id: { $in: userIds } })) !== new Set(userIds).size
    ) {
        return "One or more calendar attendees do not exist.";
    }
    if (value.communityId) {
        const context = await communityAccess(userId, value.communityId, "meetings", [
            Permissions.READ_OWN,
            Permissions.READ_OTHER,
        ]);
        const members = context
            ? new Set([...context.community.ownerIds, ...context.community.userIds].map(String))
            : new Set();
        if (userIds.some((id) => !members.has(id)))
            return "Scoped event attendees must belong to the community.";
    }
    return undefined;
}
