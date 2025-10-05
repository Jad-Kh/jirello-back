"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsernameValidator = exports.getUserByEmailValidator = exports.getUserByIdValidator = void 0;
const validator_ts_1 = require("../helpers/validator.ts");
const UserErrorResponses_ts_1 = require("../responses/errors/UserErrorResponses.ts");
const userValidationSchemes_ts_1 = require("./schemes/userValidationSchemes.ts");
exports.getUserByIdValidator = (0, validator_ts_1.createValidator)(userValidationSchemes_ts_1.UserValidationSchemes.getUserByIdValidationScheme, UserErrorResponses_ts_1.UserErrorResponses.USER_NOT_FOUND, true);
exports.getUserByEmailValidator = (0, validator_ts_1.createValidator)(userValidationSchemes_ts_1.UserValidationSchemes.getUserByEmailValidationScheme, UserErrorResponses_ts_1.UserErrorResponses.EMAIL_ERROR);
exports.getUserByUsernameValidator = (0, validator_ts_1.createValidator)(userValidationSchemes_ts_1.UserValidationSchemes.getUserByUsernameValidationScheme, UserErrorResponses_ts_1.UserErrorResponses.USERNAME_NOT_FOUND);
