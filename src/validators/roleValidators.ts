import { AssignRoleToUserRequest } from "../handlers/role/assignRoleToUserHandler/assignRoleToUserRequest.js";
import { RoleRequest } from "../handlers/role/createRoleHandler/createRoleRequest.js";
import { RemoveUserFromRoleRequest } from "../handlers/role/removeUserFromRoleHandler/removeUserFromRoleRequest.js";
import { UpdateRoleRequest } from "../handlers/role/updateRoleHandler/updateRoleRequest.js";
import { createValidator } from "../helpers/validator.js";
import { APISignature } from "../models/api/APISignature.js";
import { RoleErrorResponses } from "../responses/errors/RoleErrorResponses.js";
import { RoleValidationSchemes } from "./schemes/roleValidationSchemes.js";

export const createRoleValidator = createValidator<RoleRequest>(
    RoleValidationSchemes.createRoleValidationScheme,
    RoleErrorResponses.CREATION_ERROR,
);

export const updateRoleValidator = createValidator<UpdateRoleRequest>(
    RoleValidationSchemes.updateRoleValidationScheme,
    RoleErrorResponses.UPDATE_ERROR,
    true,
);

export const roleByIdValidator = createValidator<APISignature>(
    RoleValidationSchemes.roleByIdValidationScheme,
    RoleErrorResponses.ID_ERROR,
    true,
);

export const assignRoleToUserValidator = createValidator<AssignRoleToUserRequest>(
    RoleValidationSchemes.assignUserToRoleValidationScheme,
    RoleErrorResponses.ROLE_USER_ASSINGING_ERROR,
);

export const removeUserFromRoleValidator = createValidator<RemoveUserFromRoleRequest>(
    RoleValidationSchemes.removeUserFromRoleValidationScheme,
    RoleErrorResponses.ROLE_USER_REMOVING_ERROR,
);
