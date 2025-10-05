"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleErrorResponses = void 0;
const RoleErrorResponses = {
    ID_ERROR: {
        message: 'Role not found or Id does not exist',
        code: 404
    },
    ROLE_NAME_ALREADY_EXISTS: {
        message: 'Role name already exists',
        code: 400
    },
    ROLE_NOT_FOUND: {
        message: "No role with this id exists",
        code: 404
    },
    CREATION_ERROR: {
        message: "Error creating role",
        code: 400
    },
    UPDATE_ERROR: {
        message: "Error updating role",
        code: 400
    },
    ROLE_USER_ASSINGING_ERROR: {
        message: "Error assgining role to user",
        code: 400
    },
    ROLE_USER_REMOVING_ERROR: {
        message: "Error removing user from role",
        code: 400
    },
    ROLE_USER_FOUND: {
        message: "User already has this role",
        code: 400
    },
    ROLE_USER_NOT_FOUND: {
        message: "Role is not assigned to this user",
        code: 404
    }
};
exports.RoleErrorResponses = RoleErrorResponses;
