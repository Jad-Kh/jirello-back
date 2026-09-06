import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const getUserByIdValidationScheme = Joi.object({ id: objectId.required() });
const getUserByEmailValidationScheme = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
});
const getUserByUsernameValidationScheme = Joi.object({
    username: Joi.string().trim().min(2).max(30).required(),
});

export const UserValidationSchemes = {
    getUserByIdValidationScheme,
    getUserByEmailValidationScheme,
    getUserByUsernameValidationScheme,
};
