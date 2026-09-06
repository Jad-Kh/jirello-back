import Joi from "joi";

export const objectId = Joi.string().hex().length(24);

export const createTaskValidationScheme = Joi.object({
    projectId: objectId.required(),
    title: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().trim().allow("").max(5000).default(""),
    priority: Joi.string().valid("low", "medium", "high", "urgent").default("medium"),
    deadline: Joi.alternatives()
        .try(Joi.string().isoDate(), Joi.string().valid("Unlimited"))
        .default("Unlimited"),
    status: Joi.string()
        .trim()
        .lowercase()
        .pattern(/^[a-z][a-z0-9-]{0,49}$/),
    position: Joi.number().min(0).default(0),
    reviewerId: objectId,
    assigneeIds: Joi.array().items(objectId).unique().max(99).default([]),
    typeKey: Joi.string()
        .trim()
        .lowercase()
        .pattern(/^[a-z][a-z0-9-]{0,49}$/)
        .default("task"),
    customFields: Joi.object().unknown(true).default({}),
    parentId: objectId,
    dependencyIds: Joi.array().items(objectId).unique().max(100).default([]),
    relatedTaskIds: Joi.array().items(objectId).unique().max(100).default([]),
    tags: Joi.array().items(Joi.string().trim().lowercase().max(50)).unique().max(50).default([]),
    startAt: Joi.date().iso(),
    estimatedMinutes: Joi.number().integer().min(0).max(5_256_000),
    milestone: Joi.boolean().default(false),
    recurrence: Joi.object({
        frequency: Joi.string().valid("daily", "weekly", "monthly").required(),
        interval: Joi.number().integer().min(1).max(365).default(1),
        until: Joi.date().iso(),
    }),
    audience: Joi.string().valid("internal", "client").default("internal"),
});

export const getProjectTasksValidationScheme = Joi.object({
    projectId: objectId.required(),
    status: Joi.string()
        .trim()
        .lowercase()
        .pattern(/^[a-z][a-z0-9-]{0,49}$/),
    search: Joi.string().trim().max(200),
    cursor: Joi.string().max(512),
    limit: Joi.number().integer().min(1).max(100).default(50),
});

export const updateTaskValidationScheme = Joi.object({
    id: objectId.required(),
    version: Joi.number().integer().min(1).required(),
    title: Joi.string().trim().min(1).max(200),
    description: Joi.string().trim().allow("").max(5000),
    priority: Joi.string().valid("low", "medium", "high", "urgent"),
    deadline: Joi.alternatives().try(Joi.string().isoDate(), Joi.string().valid("Unlimited")),
    status: Joi.string()
        .trim()
        .lowercase()
        .pattern(/^[a-z][a-z0-9-]{0,49}$/),
    position: Joi.number().min(0),
    reviewerId: objectId,
    assigneeIds: Joi.array().items(objectId).unique().max(99),
    typeKey: Joi.string()
        .trim()
        .lowercase()
        .pattern(/^[a-z][a-z0-9-]{0,49}$/),
    customFields: Joi.object().unknown(true),
    parentId: objectId.allow(null),
    dependencyIds: Joi.array().items(objectId).unique().max(100),
    relatedTaskIds: Joi.array().items(objectId).unique().max(100),
    tags: Joi.array().items(Joi.string().trim().lowercase().max(50)).unique().max(50),
    startAt: Joi.date().iso().allow(null),
    estimatedMinutes: Joi.number().integer().min(0).max(5_256_000).allow(null),
    milestone: Joi.boolean(),
    recurrence: Joi.object({
        frequency: Joi.string().valid("daily", "weekly", "monthly").required(),
        interval: Joi.number().integer().min(1).max(365).default(1),
        until: Joi.date().iso(),
    }).allow(null),
    audience: Joi.string().valid("internal", "client"),
}).min(3);

export const reorderTasksValidationScheme = Joi.object({
    projectId: objectId.required(),
    changes: Joi.array()
        .items(
            Joi.object({
                id: objectId.required(),
                version: Joi.number().integer().min(1).required(),
                status: Joi.string().valid("todo", "in-progress", "blocked", "done").required(),
                position: Joi.number().min(0).required(),
            }),
        )
        .unique("id")
        .min(1)
        .max(50)
        .required(),
});
