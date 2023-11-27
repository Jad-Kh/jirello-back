import Joi from "joi"

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
    roleByIdValidationScheme,
    assignUserToRoleValidationScheme,
    removeUserFromRoleValidationScheme
}