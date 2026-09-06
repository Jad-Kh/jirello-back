import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const createProjectValidationScheme = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    communityId: objectId.required(),
});

const updateProjectValidationScheme = Joi.object({
    id: objectId.required(),
    name: Joi.string().trim().min(2).max(100),
    organizerIds: Joi.array().items(objectId),
    userIds: Joi.array().items(objectId),
    taskIds: Joi.array().items(objectId),
    taskGroupIds: Joi.array().items(objectId),
}).min(2);

export const ProjectValidationSchemes = {
    createProjectValidationScheme,
    updateProjectValidationScheme,
};
