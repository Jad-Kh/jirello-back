import type { ICalendarEvent } from "../../database/models/calendar/ICalendarEvent.js";
import { APISignature } from "../api/APISignature.js";

export class CalendarEventResponse extends APISignature {
    ownerId: string;
    calendarId?: string;
    organizerId: string;
    communityId?: string;
    projectId?: string;
    taskId?: string;
    seriesId?: string;
    originalStartAt?: Date;
    kind: ICalendarEvent["kind"];
    title: string;
    description?: string;
    startAt: Date;
    endAt: Date;
    allDay: boolean;
    timezone: string;
    location?: string;
    conferenceUrl?: string;
    color?: string;
    visibility: ICalendarEvent["visibility"];
    availability: ICalendarEvent["availability"];
    status: ICalendarEvent["status"];
    attendees: ICalendarEvent["attendees"];
    reminders: ICalendarEvent["reminders"];
    recurrence?: ICalendarEvent["recurrence"];
    version: number;

    constructor(values: ICalendarEvent) {
        super(values);
        this.ownerId = values.ownerId;
        this.calendarId = values.calendarId;
        this.organizerId = values.organizerId;
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.taskId = values.taskId;
        this.seriesId = values.seriesId;
        this.originalStartAt = values.originalStartAt;
        this.kind = values.kind;
        this.title = values.title;
        this.description = values.description;
        this.startAt = values.startAt;
        this.endAt = values.endAt;
        this.allDay = values.allDay;
        this.timezone = values.timezone;
        this.location = values.location;
        this.conferenceUrl = values.conferenceUrl;
        this.color = values.color;
        this.visibility = values.visibility;
        this.availability = values.availability;
        this.status = values.status;
        this.attendees = values.attendees;
        this.reminders = values.reminders;
        this.recurrence = values.recurrence;
        this.version = values.version;
    }
}
