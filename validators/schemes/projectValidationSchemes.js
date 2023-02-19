import Joi from "joi"

const createProjectValidationScheme = Joi.object().keys({
    name: Joi.string().required(),
    communityId: Joi.string().alphanum().required()
});

export {
    createProjectValidationScheme
}