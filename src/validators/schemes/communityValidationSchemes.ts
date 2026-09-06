import Joi from "joi";

const objectId = Joi.string().hex().length(24);
const permissionList = Joi.array().items(Joi.number().integer().min(1).max(10)).unique();

const communityByIdValidationScheme = Joi.object({ id: objectId.required() });

const createCommunityValidationScheme = Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    flag: Joi.string().trim().uppercase().min(2).max(5).required(),
    template: Joi.string().trim().max(50).default("Normal"),
});

const updateCommunityValidationScheme = Joi.object({
    id: objectId.required(),
    name: Joi.string().trim().min(2).max(80),
    flag: Joi.string().trim().uppercase().min(2).max(5),
    template: Joi.string().trim().max(50),
    validationLevel: Joi.number().integer().min(0),
    requiredValidationLevel: Joi.number().integer().min(0),
}).min(2);

const membershipValidationScheme = Joi.object({
    communityId: objectId.required(),
    userId: objectId.required(),
});

const projectMembershipValidationScheme = Joi.object({
    communityId: objectId.required(),
    projectId: objectId.required(),
});

const updateCommunityPermissionsValidationScheme = Joi.object({
    id: objectId.required(),
    tasks: permissionList.required(),
    taskGroups: permissionList.required(),
    meetings: permissionList.required(),
    projects: permissionList.required(),
    screens: permissionList.required(),
    roles: permissionList.required(),
    users: permissionList.required(),
    communities: permissionList.required(),
});

export const CommunityValidationSchemes = {
    communityByIdValidationScheme,
    createCommunityValidationScheme,
    updateCommunityValidationScheme,
    addUserToCommunityValidationScheme: membershipValidationScheme,
    removeUserFromCommunityValidationScheme: membershipValidationScheme,
    addProjectToCommunityValidationScheme: projectMembershipValidationScheme,
    removeProjectFromCommunityValidationScheme: projectMembershipValidationScheme,
    updateCommunityPermissionsValidationScheme,
};
