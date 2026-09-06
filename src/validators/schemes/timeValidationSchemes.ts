import Joi from "joi";

export const objectId = Joi.string().hex().length(24);

export const date = Joi.date().iso();

export const timeEntryValidationScheme = Joi.object({
    communityId: objectId.required(),
    projectId: objectId,
    taskId: objectId,
    description: Joi.string().trim().allow("").max(2000),
    startedAt: date.required(),
    endedAt: date,
    durationMinutes: Joi.number().integer().min(0).max(525600),
    billable: Joi.boolean().default(false),
}).oxor("endedAt", "durationMinutes");

export const updateTimeEntryValidationScheme = timeEntryValidationScheme
    .fork(["communityId", "startedAt"], (schema) => schema.optional())
    .append({ version: Joi.number().integer().min(1).required() })
    .min(2);

export const memberCapacityValidationScheme = Joi.object({
    communityId: objectId.required(),
    timezone: Joi.string().trim().min(1).max(100).required(),
    weeklyMinutes: Joi.number().integer().min(0).max(10080).required(),
    workingDays: Joi.array().items(Joi.number().integer().min(0).max(6)).unique().max(7).required(),
    dailyMinutes: Joi.number().integer().min(0).max(1440).required(),
    overrides: Joi.array()
        .items(
            Joi.object({
                date: Joi.string().isoDate().required(),
                availableMinutes: Joi.number().integer().min(0).max(1440).required(),
                note: Joi.string().trim().allow("").max(500),
            }),
        )
        .unique("date")
        .max(366)
        .default([]),
});

export const getMemberCapacityValidationScheme = Joi.object({
    communityId: objectId.required(),
    cursor: objectId,
    limit: Joi.number().integer().min(1).max(100).default(50),
});

export const getTimeEntriesValidationScheme = Joi.object({
    communityId: objectId.required(),
    projectId: objectId,
    userId: objectId,
    taskId: objectId,
    from: date.required(),
    to: date.required(),
    status: Joi.string().valid("draft", "submitted", "approved", "rejected"),
    cursor: Joi.string().max(512),
    limit: Joi.number().integer().min(1).max(100).default(50),
});

export const getWorkloadValidationScheme = Joi.object({
    communityId: objectId.required(),
    from: date.required(),
    to: date.required(),
});

export const reviewTimeEntryValidationScheme = Joi.object({
    decision: Joi.string().valid("approved", "rejected").required(),
    reason: Joi.string().trim().allow("").max(1000),
    version: Joi.number().integer().min(1).required(),
});

export const submitTimesheetValidationScheme = Joi.object({
    communityId: objectId.required(),
    from: date.required(),
    to: date.required(),
});
