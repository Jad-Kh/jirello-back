import { createPresenter } from "../helpers/presenting";
import { RoleSuccessResponses } from "../responses/success/RoleSuccessResponses.ts";
import { RoleResponse } from "../models/role/RoleResponse.ts";
import { RolesOfUserResponse } from "../models/role/RolesOfUserResponse.ts";

export const createRolePresenter = createPresenter(
    RoleSuccessResponses.CREATE_ROLE_SUCCESS,
    RoleResponse,
    "role"
);

export const updateRolePresenter = createPresenter(
    RoleSuccessResponses.UPDATE_ROLE_SUCCESS,
    RoleResponse,
    "role"
);

export const deleteRolePresenter = createPresenter(
    RoleSuccessResponses.DELETE_ROLE_SUCCESS,
    RoleResponse,
    "role"
);

export const assignRolePresenter = createPresenter(
    RoleSuccessResponses.ASSIGN_ROLE_TO_USER_SUCCESS
);

export const removeRolePresenter = createPresenter(
    RoleSuccessResponses.REMOVE_ROLE_FROM_USER_SUCCESS
);

export const getUserRolesPresenter = createPresenter(
    RoleSuccessResponses.ROLES_OF_USER_SUCCESS,
    RolesOfUserResponse,
    "roles",
    true
);