import Joi from "joi"

const createRoleValidationScheme = Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    communityId: Joi.string().required(),
    parentRoleId: Joi.string().alphanum(),
    priorityPosition: Joi.number().required(),
    projectBased: Joi.boolean()
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

export {
    createRoleValidationScheme,
    roleByIdValidationScheme,
    assignUserToRoleValidationScheme,
    removeUserFromRoleValidationScheme
}