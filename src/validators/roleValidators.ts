import { createValidator } from "../helpers/validator.ts";
import { RoleRequest } from "../handlers/role/createRoleHandler/createRoleRequest.ts";
import { APISignature } from "../models/api/APISignature.ts";
import { AssignRoleToUserRequest } from "../handlers/role/assignRoleToUserHandler/assignRoleToUserRequest.ts";
import { RemoveUserFromRoleRequest } from "../handlers/role/removeUserFromRoleHandler/removeUserFromRoleRequest.ts";
import { RoleErrorResponses } from "../responses/errors/RoleErrorResponses.ts";
import { RoleValidationSchemes } from "./schemes/roleValidationSchemes.ts";

export const createRoleValidator = createValidator<RoleRequest>(
    RoleValidationSchemes.createRoleValidationScheme,
    RoleErrorResponses.CREATION_ERROR
);

export const updateRoleValidator = createValidator<RoleRequest>(
    RoleValidationSchemes.updateRoleValidationScheme,
    RoleErrorResponses.UPDATE_ERROR,
    true
);

export const roleByIdValidator = createValidator<APISignature>(
    RoleValidationSchemes.roleByIdValidationScheme,
    RoleErrorResponses.ID_ERROR,
    true
);

export const assignRoleToUserValidator = createValidator<AssignRoleToUserRequest>(
    RoleValidationSchemes.assignUserToRoleValidationScheme,
    RoleErrorResponses.ROLE_USER_ASSINGING_ERROR,
    true
);

export const removeUserFromRoleValidator = createValidator<RemoveUserFromRoleRequest>(
    RoleValidationSchemes.removeUserFromRoleValidationScheme,
    RoleErrorResponses.ROLE_USER_REMOVING_ERROR,
    true
);