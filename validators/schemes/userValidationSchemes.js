import Joi from "joi"

const getUserByIdValidationScheme = Joi.object().keys({
    id: Joi.string().alphanum().required()
});

const getUserByEmailValidationScheme = Joi.object().keys({
    email: Joi.string().required()
});

const getUserByUsernameValidationScheme = Joi.object().keys({
    email: Joi.string().required()
});

export {
    getUserByIdValidationScheme,
    getUserByEmailValidationScheme,
    getUserByUsernameValidationScheme
}