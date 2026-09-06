import Joi from "joi";

export const objectId = Joi.string().hex().length(24);

export const key = Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z][a-z0-9-]{0,49}$/);

export const workStatusValidationScheme = Joi.object({
    key: key.required(),
    name: Joi.string().trim().min(1).max(80).required(),
    category: Joi.string().valid("todo", "in-progress", "done").required(),
    position: Joi.number().integer().min(0).required(),
});

export const workFieldValidationScheme = Joi.object({
    key: key.required(),
    label: Joi.string().trim().min(1).max(100).required(),
    type: Joi.string()
        .valid("text", "number", "boolean", "date", "currency", "select", "multi-select", "user")
        .required(),
    required: Joi.boolean().default(false),
    options: Joi.array().items(Joi.string().trim().max(100)).unique().max(100).default([]),
    defaultValue: Joi.any(),
});

export const workConfigurationValidationScheme = Joi.object({
    communityId: objectId.required(),
    projectId: objectId,
    key: key.required(),
    name: Joi.string().trim().min(1).max(100).required(),
    description: Joi.string().trim().allow("").max(2000),
    color: Joi.string().pattern(/^#[0-9a-f]{6}$/i),
    icon: Joi.string().trim().max(100),
    statuses: Joi.array().items(workStatusValidationScheme).unique("key").min(1).max(50).required(),
    fields: Joi.array().items(workFieldValidationScheme).unique("key").max(100).default([]),
    transitions: Joi.array()
        .items(Joi.object({ from: key.required(), to: key.required() }))
        .unique((a, b) => a.from === b.from && a.to === b.to)
        .max(250)
        .default([]),
    isDefault: Joi.boolean().default(false),
});

export const updateWorkConfigurationValidationScheme = workConfigurationValidationScheme
    .fork(["communityId", "key", "name", "statuses"], (schema) => schema.optional())
    .append({ version: Joi.number().integer().min(1).required() })
    .min(2);

export const savedWorkViewValidationScheme = Joi.object({
    communityId: objectId.required(),
    projectId: objectId,
    name: Joi.string().trim().min(1).max(120).required(),
    visibility: Joi.string().valid("private", "project", "community").default("private"),
    layout: Joi.string().valid("board", "list", "table", "calendar", "timeline").required(),
    filters: Joi.object().unknown(true).default({}),
    sort: Joi.array()
        .items(
            Joi.object({
                field: Joi.string().max(100).required(),
                direction: Joi.string().valid("asc", "desc").required(),
            }),
        )
        .max(10)
        .default([]),
    groupBy: Joi.string().max(100),
});

export const workTemplateValidationScheme = Joi.object({
    communityId: objectId.required(),
    projectId: objectId,
    name: Joi.string().trim().min(1).max(120).required(),
    description: Joi.string().trim().allow("").max(2000),
    typeKey: key.required(),
    defaults: Joi.object().unknown(true).required(),
});

export const getWorkConfigurationsValidationScheme = Joi.object({
    communityId: objectId.required(),
    projectId: objectId,
});

export const getWorkTemplatesValidationScheme = Joi.object({
    communityId: objectId.required(),
    projectId: objectId,
});

export const getSavedWorkViewsValidationScheme = Joi.object({
    communityId: objectId.required(),
    projectId: objectId,
});
