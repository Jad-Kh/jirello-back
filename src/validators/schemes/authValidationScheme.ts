import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const signUpValidationScheme = Joi.object({
    username: Joi.string().trim().min(2).max(30).required(),
    email: Joi.string().trim().lowercase().email().required(),
    firstName: Joi.string().trim().min(2).max(25).required(),
    lastName: Joi.string().trim().min(2).max(25).required(),
    password: Joi.string().min(8).max(128).required(),
    birthday: Joi.string().isoDate().required(),
});

const logInValidationScheme = Joi.object({
    username: Joi.string().trim().min(2).max(30),
    email: Joi.string().trim().lowercase().email(),
    password: Joi.string().min(1).max(128).required(),
}).xor("username", "email");

const recoveryValidationScheme = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
});

const resetPasswordValidationScheme = Joi.object({
    token: Joi.string().min(32).max(256).required(),
    password: Joi.string().min(8).max(128).required(),
});

const refreshTokenValidationScheme = Joi.object({
    refreshToken: Joi.string(),
});

const logoutValidationScheme = Joi.object({
    id: objectId,
});

export const AuthValidationSchemes = {
    signUpValidationScheme,
    logInValidationScheme,
    recoveryValidationScheme,
    resetPasswordValidationScheme,
    refreshTokenValidationScheme,
    logoutValidationScheme,
};
