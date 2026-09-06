import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const createRoleValidationScheme = Joi.object({
    title: Joi.string().trim().min(2).max(30).required(),
    communityId: objectId.required(),
    parentRoleId: objectId.allow(""),
    priorityPosition: Joi.number().integer().min(0).required(),
    projectBased: Joi.boolean().default(false),
});

const updateRoleValidationScheme = Joi.object({
    id: objectId.required(),
    title: Joi.string().trim().min(2).max(30),
    overrideAll: Joi.boolean(),
    parentRoleId: objectId.allow(""),
    priorityPosition: Joi.number().integer().min(0),
    projectBased: Joi.boolean(),
    projectIds: Joi.array().items(objectId),
}).min(2);

const roleByIdValidationScheme = Joi.object({ id: objectId.required() });
const roleMembershipValidationScheme = Joi.object({
    roleId: objectId.required(),
    userId: objectId.required(),
});

export const RoleValidationSchemes = {
    createRoleValidationScheme,
    updateRoleValidationScheme,
    roleByIdValidationScheme,
    assignUserToRoleValidationScheme: roleMembershipValidationScheme,
    removeUserFromRoleValidationScheme: roleMembershipValidationScheme,
};
