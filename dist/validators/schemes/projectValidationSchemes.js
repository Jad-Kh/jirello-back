"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidationSchemes = void 0;
const joi_1 = __importDefault(require("joi"));
const createProjectValidationScheme = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    communityId: joi_1.default.string().alphanum().required()
});
const updateProjectValidationScheme = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    organizerIds: joi_1.default.array().required(),
    userIds: joi_1.default.array().required(),
    communityId: joi_1.default.string().alphanum().required()
});
exports.ProjectValidationSchemes = {
    createProjectValidationScheme,
    updateProjectValidationScheme
};
