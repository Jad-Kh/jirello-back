import Joi from "joi";

const objectId = Joi.string().hex().length(24);

export const updateNotificationPreferencesValidationScheme = Joi.object({
    muteAll: Joi.boolean(),
    mutedCommunityIds: Joi.array().items(objectId).unique().max(500),
    mutedChatIds: Joi.array().items(objectId).unique().max(500),
}).min(1);
