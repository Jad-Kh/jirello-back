import express from 'express'
const roleRoutes = express.Router();

import { assignRoleToUserValidator, removeUserFromRoleValidator } from '../validators/roleValidators.js';
import {
    assignRoleToUserHandler,
    getCommunityRoleHierarchyHandler,
    getCommunityRolesHandler,
    getCommunityRolesPaginatedHandler,
    removeUserFromRoleHandler
} from '../handlers/roleHandler.js';
import {
    assignRoleToUserPresenter,
    getCommunityRoleHierarchyPresenter,
    getCommunityRolesPresenter,
    removeUserFromRolePresenter
} from '../presenters/rolePresenter.js';
import { roleController } from '../controllers/roleController.js';
import { tokenSecurity } from '../security/tokenSecurity.js';
import { communityByIdValidator } from '../validators/communityValidators.js';

roleRoutes.put(
    "/assign-role-to-user",
    tokenSecurity,
    assignRoleToUserValidator,
    assignRoleToUserHandler,
    assignRoleToUserPresenter,
    roleController,
);

roleRoutes.put(
    "/remove-user-from-role",
    tokenSecurity,
    removeUserFromRoleValidator,
    removeUserFromRoleHandler,
    removeUserFromRolePresenter,
    roleController,
);

roleRoutes.get(
    "/get-community-roles/:id",
    tokenSecurity,
    communityByIdValidator,
    getCommunityRolesHandler,
    getCommunityRolesPresenter,
    roleController,
);

roleRoutes.get(
    "/get-community-roles-paginated/:id",
    tokenSecurity,
    communityByIdValidator,
    getCommunityRolesPaginatedHandler,
    getCommunityRolesPresenter,
    roleController,
);

roleRoutes.get(
    "/get-community-role-hierarchy/:id",
    tokenSecurity,
    communityByIdValidator,
    getCommunityRoleHierarchyHandler,
    getCommunityRoleHierarchyPresenter,
    roleController,
);

export {
    roleRoutes
}