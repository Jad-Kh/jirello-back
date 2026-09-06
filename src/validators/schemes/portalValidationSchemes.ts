import Joi from "joi";

export const objectId = Joi.string().hex().length(24);

export const deliverableAssetValidationScheme = Joi.object({
    url: Joi.string().uri().max(2048).required(),
    name: Joi.string().trim().min(1).max(255).required(),
    mimeType: Joi.string().trim().max(150),
    revision: Joi.number().integer().min(1).required(),
});

export const getClientCommentsValidationScheme = Joi.object({
    deliverableId: objectId,
    taskId: objectId,
}).xor("deliverableId", "taskId");

export const updateDeliverableValidationScheme = Joi.object({
    version: Joi.number().integer().min(1).required(),
    title: Joi.string().trim().min(1).max(200),
    description: Joi.string().trim().allow("").max(5000),
    dueAt: Joi.date().iso().allow(null),
    assets: Joi.array().items(deliverableAssetValidationScheme).max(100),
    submit: Joi.boolean(),
}).min(2);

export const decideDeliverableValidationScheme = Joi.object({
    decision: Joi.string().valid("approved", "changes-requested").required(),
    note: Joi.string().trim().allow("").max(2000),
    version: Joi.number().integer().min(1).required(),
});

export const createClientCommentValidationScheme = Joi.object({
    deliverableId: objectId,
    taskId: objectId,
    body: Joi.string().trim().min(1).max(5000).required(),
    annotation: Joi.object({
        assetUrl: Joi.string().uri().max(2048).required(),
        page: Joi.number().integer().min(1),
        x: Joi.number().min(0).max(1),
        y: Joi.number().min(0).max(1),
    }),
}).xor("deliverableId", "taskId");

export const createDeliverableValidationScheme = Joi.object({
    taskId: objectId,
    title: Joi.string().trim().min(1).max(200).required(),
    description: Joi.string().trim().allow("").max(5000),
    dueAt: Joi.date().iso(),
    submit: Joi.boolean().default(false),
    assets: Joi.array().items(deliverableAssetValidationScheme).max(100).default([]),
});

export const grantGuestAccessValidationScheme = Joi.object({
    userId: objectId.required(),
    role: Joi.string().valid("viewer", "commenter", "approver").default("viewer"),
    expiresAt: Joi.date().iso().greater("now"),
});

export const configureClientPortalValidationScheme = Joi.object({
    enabled: Joi.boolean().required(),
    name: Joi.string().trim().allow("").max(150),
    welcomeMessage: Joi.string().trim().allow("").max(2000),
    logoUrl: Joi.string().uri().max(2048).allow(""),
    accentColor: Joi.string().pattern(/^#[0-9a-f]{6}$/i),
    showProgress: Joi.boolean().default(true),
    showMilestones: Joi.boolean().default(true),
    showFinancials: Joi.boolean().default(false),
    publicEnabled: Joi.boolean().default(false),
    publicSlug: Joi.string()
        .trim()
        .lowercase()
        .pattern(/^[a-z0-9][a-z0-9-]{2,79}$/),
});
