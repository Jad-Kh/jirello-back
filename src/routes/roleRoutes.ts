import { Request, Router } from "express";
import { assignRoleToUserHandler } from "../handlers/role/assignRoleToUserHandler/assignRoleToUserHandler.js";
import { createRoleHandler } from "../handlers/role/createRoleHandler/createRoleHandler.js";
import { getCommunityRolesHandler } from "../handlers/role/getCommunityRolesHandler/getCommunityRolesHandler.js";
import { removeUserFromRoleHandler } from "../handlers/role/removeUserFromRoleHandler/removeUserFromRoleHandler.js";
import { updateRoleHandler } from "../handlers/role/updateRoleHandler/updateRoleHandler.js";
import { endpointForward } from "../helpers/endpointForward.js";
import { Permissions } from "../helpers/permissions.js";
import {
    assignRolePresenter,
    createRolePresenter,
    getUserRolesPresenter,
    removeRolePresenter,
    updateRolePresenter,
} from "../presenters/rolePresenter.js";
import { requireCommunityPermission } from "../security/permissionSecurity.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import {
    assignRoleToUserValidator,
    createRoleValidator,
    removeUserFromRoleValidator,
    roleByIdValidator,
    updateRoleValidator,
} from "../validators/roleValidators.js";

const roleRoutes = Router();

const bodyCommunityId = (request: Request): string | undefined => request.body?.communityId;

const parameterCommunityId = (request: Request): string | undefined => {
    const id = request.params.id;
    return Array.isArray(id) ? id[0] : id;
};

roleRoutes.use(tokenSecurity);
roleRoutes.post(
    "/create-role",
    createRoleValidator,
    requireCommunityPermission("roles", [Permissions.CREATE_OWN, Permissions.CREATE_OTHER], bodyCommunityId),
    createRoleHandler,
    createRolePresenter,
    endpointForward,
);
roleRoutes.put(
    "/update-role/:id",
    updateRoleValidator,
    requireCommunityPermission("roles", [Permissions.EDIT_OWN, Permissions.EDIT_OTHER]),
    updateRoleHandler,
    updateRolePresenter,
    endpointForward,
);
roleRoutes.put(
    "/assign-role-to-user",
    assignRoleToUserValidator,
    requireCommunityPermission("roles", [Permissions.CHANGE_OTHER]),
    assignRoleToUserHandler,
    assignRolePresenter,
    endpointForward,
);
roleRoutes.put(
    "/remove-user-from-role",
    removeUserFromRoleValidator,
    requireCommunityPermission("roles", [Permissions.CHANGE_OTHER]),
    removeUserFromRoleHandler,
    removeRolePresenter,
    endpointForward,
);
roleRoutes.get(
    "/get-community-roles/:id",
    roleByIdValidator,
    requireCommunityPermission("roles", [Permissions.READ_OWN, Permissions.READ_OTHER], parameterCommunityId),
    getCommunityRolesHandler,
    getUserRolesPresenter,
    endpointForward,
);

export { roleRoutes };
