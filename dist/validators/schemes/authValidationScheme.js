"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidationSchemes = void 0;
const joi_1 = __importDefault(require("joi"));
const validations_ts_1 = require("../validations/validations.ts");
const signUpValidationScheme = joi_1.default.object().keys({
    username: joi_1.default.string().required().max(30).min(2),
    email: joi_1.default.string().required().custom(validations_ts_1.emailValidation),
    firstName: joi_1.default.string().required().max(25).min(2),
    lastName: joi_1.default.string().required().max(25).min(2),
    password: joi_1.default.string().required().custom(validations_ts_1.passwordValidation),
    birthday: joi_1.default.string().required().custom(validations_ts_1.dateValidation)
});
const logInValidationScheme = joi_1.default.object().keys({
    username: joi_1.default.string(),
    email: joi_1.default.string().custom(validations_ts_1.emailValidation),
    password: joi_1.default.string().required()
});
const recoveryValidationScheme = joi_1.default.object().keys({
    email: joi_1.default.string().custom(validations_ts_1.emailValidation),
});
const refreshTokenValidationScheme = joi_1.default.object().keys({
    id: joi_1.default.string().alphanum().required()
});
const logoutValidationScheme = joi_1.default.object().keys({
    id: joi_1.default.string().alphanum().required()
});
exports.AuthValidationSchemes = {
    signUpValidationScheme,
    logInValidationScheme,
    recoveryValidationScheme,
    refreshTokenValidationScheme,
    logoutValidationScheme
};
