import Joi from "joi";

export const objectId = Joi.string().hex().length(24);

export const collaborationScopeValidationScheme = Joi.object({
    projectId: objectId,
    communityId: objectId,
}).xor("projectId", "communityId");

export const getMessagesValidationScheme = collaborationScopeValidationScheme.concat(
    Joi.object({
        kind: Joi.string().valid("chat", "comment"),
        cursor: Joi.string().max(512),
        before: Joi.date().iso(),
        limit: Joi.number().integer().min(1).max(100).default(50),
    }),
);

export const createMessageValidationScheme = collaborationScopeValidationScheme.concat(
    Joi.object({
        kind: Joi.string().valid("chat", "comment").required(),
        body: Joi.string().trim().min(1).max(5000).required(),
        parentId: objectId,
        mentionedUserIds: Joi.array().items(objectId).unique().max(100).default([]),
    }),
);

export const updateMessageValidationScheme = Joi.object({
    body: Joi.string().trim().min(1).max(5000).required(),
    version: Joi.number().integer().min(1).required(),
    mentionedUserIds: Joi.array().items(objectId).unique().max(100),
});

export const reportMessageValidationScheme = Joi.object({
    reason: Joi.string().valid("spam", "harassment", "inappropriate", "other").required(),
    details: Joi.string().trim().max(1000).allow(""),
});

export const reviewMessageReportValidationScheme = Joi.object({
    status: Joi.string().valid("reviewed", "dismissed", "actioned").required(),
});
