import express from 'express'
const roleRoutes = express.Router();

import { assignRoleToUserValidator, removeUserFromRoleValidator } from '../validators/roleValidators.js';
import { assignRoleToUserHandler, getCommunityRolesHandler, removeUserFromRoleHandler } from '../handlers/roleHandler.js';
import { assignRoleToUserPresenter, getCommunityRolesPresenter, removeUserFromRolePresenter } from '../presenters/rolePresenter.js';
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
    "/get-community-roles",
    tokenSecurity,
    communityByIdValidator,
    getCommunityRolesHandler,
    getCommunityRolesPresenter,
    roleController,
)

export {
    roleRoutes
}