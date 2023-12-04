import Joi from "joi"

const createProjectValidationScheme = Joi.object().keys({
    name: Joi.string().required(),
    communityId: Joi.string().alphanum().required()
});

const updateProjectValidationScheme = Joi.object().keys({
    name: Joi.string().required(),
    organizerIds: Joi.array().required(),
    userIds: Joi.array().required(),
    communityId: Joi.string().alphanum().required()
});

export {
    createProjectValidationScheme,
    updateProjectValidationScheme
}