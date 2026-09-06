import Joi from "joi";

export const objectId = Joi.string().hex().length(24);

export const isoDate = Joi.date().iso();

export const calendarAttendeeValidationScheme = Joi.object({
    userId: objectId,
    email: Joi.string().trim().lowercase().email(),
    name: Joi.string().trim().max(150),
    optional: Joi.boolean().default(false),
}).xor("userId", "email");

export const calendarRecurrenceValidationScheme = Joi.object({
    frequency: Joi.string().valid("daily", "weekly", "monthly", "yearly").required(),
    interval: Joi.number().integer().min(1).max(365).default(1),
    byWeekday: Joi.array().items(Joi.number().integer().min(0).max(6)).unique().max(7).default([]),
    until: isoDate,
    count: Joi.number().integer().min(1).max(1000),
    excludedDates: Joi.array().items(isoDate).unique().max(500).default([]),
}).oxor("until", "count");

export const calendarEventValidationScheme = Joi.object({
    calendarId: objectId,
    communityId: objectId,
    projectId: objectId,
    taskId: objectId,
    kind: Joi.string()
        .valid("event", "meeting", "focus", "reminder", "out-of-office", "appointment", "deadline")
        .default("event"),
    title: Joi.string().trim().min(1).max(300).required(),
    description: Joi.string().trim().allow("").max(10000),
    startAt: isoDate.required(),
    endAt: isoDate.required(),
    allDay: Joi.boolean().default(false),
    timezone: Joi.string().trim().min(1).max(100).default("UTC"),
    location: Joi.string().trim().allow("").max(1000),
    conferenceUrl: Joi.string().uri().allow("").max(2048),
    color: Joi.string().pattern(/^#[0-9a-f]{6}$/i),
    visibility: Joi.string().valid("private", "attendees", "project", "community").default("private"),
    availability: Joi.string().valid("busy", "free").default("busy"),
    status: Joi.string().valid("confirmed", "tentative", "cancelled").default("confirmed"),
    attendees: Joi.array().items(calendarAttendeeValidationScheme).unique("userId").max(99).default([]),
    reminders: Joi.array()
        .items(
            Joi.object({
                minutesBefore: Joi.number().integer().min(0).max(525600).required(),
                method: Joi.string().valid("notification", "email").required(),
            }),
        )
        .unique((a, b) => a.minutesBefore === b.minutesBefore && a.method === b.method)
        .max(20)
        .default([]),
    recurrence: calendarRecurrenceValidationScheme,
});

export const updateCalendarEventValidationScheme = calendarEventValidationScheme
    .fork(["title", "startAt", "endAt"], (schema) => schema.optional())
    .append({ version: Joi.number().integer().min(1).required() })
    .min(2);

export const archiveCalendarValidationScheme = Joi.object({
    version: Joi.number().integer().min(1).required(),
});

export const deleteCalendarEventValidationScheme = Joi.object({
    version: Joi.number().integer().min(1).required(),
});

export const deleteCalendarOccurrenceValidationScheme = Joi.object({
    occurrenceStart: isoDate.required(),
    version: Joi.number().integer().min(1).required(),
});

export const getCalendarAvailabilityValidationScheme = Joi.object({
    userIds: Joi.alternatives().try(Joi.array().items(objectId).unique().max(50), Joi.string()).required(),
    communityId: objectId,
    from: isoDate.required(),
    to: isoDate.required(),
});

export const getCalendarsValidationScheme = Joi.object({ communityId: objectId, projectId: objectId });

export const getCalendarEventsValidationScheme = Joi.object({
    from: isoDate.required(),
    to: isoDate.required(),
    communityId: objectId,
    projectId: objectId,
    includeTaskDeadlines: Joi.boolean().default(true),
});

export const updateCalendarValidationScheme = Joi.object({
    version: Joi.number().integer().min(1).required(),
    name: Joi.string().trim().min(1).max(120),
    color: Joi.string().pattern(/^#[0-9a-f]{6}$/i),
    timezone: Joi.string().trim().min(1).max(100),
    visibility: Joi.string().valid("private", "members"),
    isDefault: Joi.boolean(),
}).min(2);

export const updateCalendarOccurrenceValidationScheme = Joi.object({
    occurrenceStart: isoDate.required(),
    version: Joi.number().integer().min(1).required(),
    startAt: isoDate.required(),
    endAt: isoDate.required(),
    title: Joi.string().trim().min(1).max(300),
    description: Joi.string().trim().allow("").max(10000),
    location: Joi.string().trim().allow("").max(1000),
    conferenceUrl: Joi.string().uri().allow("").max(2048),
});

export const createCalendarValidationScheme = Joi.object({
    communityId: objectId,
    projectId: objectId,
    calendarId: objectId,
    name: Joi.string().trim().min(1).max(120).required(),
    color: Joi.string()
        .pattern(/^#[0-9a-f]{6}$/i)
        .default("#3b82f6"),
    timezone: Joi.string().trim().min(1).max(100).default("UTC"),
    visibility: Joi.string().valid("private", "members").default("private"),
    isDefault: Joi.boolean().default(false),
});

export const respondToCalendarEventValidationScheme = Joi.object({
    response: Joi.string().valid("accepted", "declined", "tentative").required(),
    version: Joi.number().integer().min(1).required(),
});
