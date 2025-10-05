"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidationSchemes = void 0;
const joi_1 = __importDefault(require("joi"));
const getUserByIdValidationScheme = joi_1.default.object().keys({
    id: joi_1.default.string().alphanum().required()
});
const getUserByEmailValidationScheme = joi_1.default.object().keys({
    email: joi_1.default.string().required()
});
const getUserByUsernameValidationScheme = joi_1.default.object().keys({
    email: joi_1.default.string().required()
});
exports.UserValidationSchemes = {
    getUserByIdValidationScheme,
    getUserByEmailValidationScheme,
    getUserByUsernameValidationScheme
};
