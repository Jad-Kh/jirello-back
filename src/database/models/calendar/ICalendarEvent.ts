import { ICommon } from "../ICommon.js";

export type CalendarEventKind =
    "event" | "meeting" | "focus" | "reminder" | "out-of-office" | "appointment" | "deadline";

export type ICalendarEvent = ICommon & {
    ownerId: string;
    calendarId?: string;
    organizerId: string;
    communityId?: string;
    projectId?: string;
    taskId?: string;
    seriesId?: string;
    originalStartAt?: Date;
    kind: CalendarEventKind;
    title: string;
    description?: string;
    startAt: Date;
    endAt: Date;
    allDay: boolean;
    timezone: string;
    location?: string;
    conferenceUrl?: string;
    color?: string;
    visibility: "private" | "attendees" | "project" | "community";
    availability: "busy" | "free";
    status: "confirmed" | "tentative" | "cancelled";
    attendees: Array<{
        userId?: string;
        email?: string;
        name?: string;
        optional: boolean;
        response: "pending" | "accepted" | "declined" | "tentative";
    }>;
    reminders: Array<{ minutesBefore: number; method: "notification" | "email" }>;
    recurrence?: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
        byWeekday: number[];
        until?: Date;
        count?: number;
        excludedDates: Date[];
    };
    version: number;
};
