"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleValidationSchemes = void 0;
const joi_1 = __importDefault(require("joi"));
const createRoleValidationScheme = joi_1.default.object().keys({
    title: joi_1.default.string().required().min(2).max(30),
    communityId: joi_1.default.string().required(),
    parentRoleId: joi_1.default.string().alphanum(),
    priorityPosition: joi_1.default.number().required(),
    projectBased: joi_1.default.boolean()
});
const updateRoleValidationScheme = joi_1.default.object().keys({
    title: joi_1.default.string().min(2).max(30),
    communityId: joi_1.default.string(),
    overrideAll: joi_1.default.string(),
    parentRoleId: joi_1.default.string(),
    priorityPosition: joi_1.default.number(),
    projectBased: joi_1.default.boolean(),
    projectIds: joi_1.default.array()
});
const roleByIdValidationScheme = joi_1.default.object().keys({
    id: joi_1.default.string().required().alphanum()
});
const assignUserToRoleValidationScheme = joi_1.default.object().keys({
    roleId: joi_1.default.string().required().alphanum(),
    userId: joi_1.default.string().required().alphanum(),
});
const removeUserFromRoleValidationScheme = joi_1.default.object().keys({
    roleId: joi_1.default.string().required().alphanum(),
    userId: joi_1.default.string().required().alphanum(),
});
exports.RoleValidationSchemes = {
    createRoleValidationScheme,
    updateRoleValidationScheme,
    roleByIdValidationScheme,
    assignUserToRoleValidationScheme,
    removeUserFromRoleValidationScheme
};
