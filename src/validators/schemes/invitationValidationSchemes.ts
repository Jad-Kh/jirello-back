import Joi from "joi";

export const objectId = Joi.string().hex().length(24);

export const createInvitationValidationScheme = Joi.object({
    communityId: objectId.required(),
    userId: objectId.required(),
});

export const respondToInvitationValidationScheme = Joi.object({
    decision: Joi.string().valid("accepted", "declined").required(),
});
