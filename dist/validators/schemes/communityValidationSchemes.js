"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityValidationSchemes = void 0;
const joi_1 = __importDefault(require("joi"));
const communityByIdValidationScheme = joi_1.default.object().keys({
    id: joi_1.default.string().required().alphanum()
});
const createCommunityValidationScheme = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    flag: joi_1.default.string().required().min(2).max(5),
    tasks: joi_1.default.array().required(),
    taskGroups: joi_1.default.array().required(),
    meetings: joi_1.default.array().required(),
    projects: joi_1.default.array().required(),
    screens: joi_1.default.array().required(),
    roles: joi_1.default.array().required(),
});
const updateCommunityValidationScheme = joi_1.default.object().keys({
    name: joi_1.default.string(),
    ownerIds: joi_1.default.array().items(joi_1.default.string().alphanum()),
    userIds: joi_1.default.array().items(joi_1.default.string().alphanum()),
    projectIds: joi_1.default.array().items(joi_1.default.string().alphanum()),
    template: joi_1.default.string(),
    permissions: joi_1.default.object({
        tasks: joi_1.default.array().required(),
        taskGroups: joi_1.default.array().required(),
        meetings: joi_1.default.array().required(),
        projects: joi_1.default.array().required(),
        screens: joi_1.default.array().required(),
        roles: joi_1.default.array().required(),
    })
});
const addUserToCommunityValidationScheme = joi_1.default.object().keys({
    communityId: joi_1.default.string().required().alphanum(),
    userId: joi_1.default.string().required().alphanum(),
});
const removeUserFromCommunityValidationScheme = joi_1.default.object().keys({
    communityId: joi_1.default.string().required().alphanum(),
    userId: joi_1.default.string().required().alphanum(),
});
const addProjectToCommunityValidationScheme = joi_1.default.object().keys({
    communityId: joi_1.default.string().required().alphanum(),
    projectId: joi_1.default.string().required().alphanum(),
});
const removeProjectFromCommunityValidationScheme = joi_1.default.object().keys({
    communityId: joi_1.default.string().required().alphanum(),
    projectId: joi_1.default.string().required().alphanum(),
});
const updateCommunityPermissionsValidationScheme = joi_1.default.object().keys({
    id: joi_1.default.string().required().alphanum(),
    tasks: joi_1.default.array().required(),
    taskGroups: joi_1.default.array().required(),
    meetings: joi_1.default.array().required(),
    projects: joi_1.default.array().required(),
    screens: joi_1.default.array().required(),
    roles: joi_1.default.array().required(),
});
exports.CommunityValidationSchemes = {
    communityByIdValidationScheme,
    createCommunityValidationScheme,
    updateCommunityValidationScheme,
    addUserToCommunityValidationScheme,
    removeUserFromCommunityValidationScheme,
    addProjectToCommunityValidationScheme,
    removeProjectFromCommunityValidationScheme,
    updateCommunityPermissionsValidationScheme
};
