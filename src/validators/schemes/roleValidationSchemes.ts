import Joi from "joi"

const createRoleValidationScheme = Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    communityId: Joi.string().required(),
    parentRoleId: Joi.string().alphanum(),
    priorityPosition: Joi.number().required(),
    projectBased: Joi.boolean()
});

const updateRoleValidationScheme = Joi.object().keys({
    title: Joi.string().min(2).max(30),
    communityId: Joi.string(),
    overrideAll: Joi.string(),
    parentRoleId: Joi.string(),
    priorityPosition: Joi.number(),
    projectBased: Joi.boolean(),
    projectIds: Joi.array()
});

const roleByIdValidationScheme = Joi.object().keys({
    id: Joi.string().required().alphanum()
});

const assignUserToRoleValidationScheme = Joi.object().keys({
    roleId: Joi.string().required().alphanum(),
    userId: Joi.string().required().alphanum(),
});

const removeUserFromRoleValidationScheme = Joi.object().keys({
    roleId: Joi.string().required().alphanum(),
    userId: Joi.string().required().alphanum(),
});

export const RoleValidationSchemes = {
    createRoleValidationScheme,
    updateRoleValidationScheme,
    roleByIdValidationScheme,
    assignUserToRoleValidationScheme,
    removeUserFromRoleValidationScheme
}