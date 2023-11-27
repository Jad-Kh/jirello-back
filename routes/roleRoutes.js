import express from 'express'
const roleRoutes = express.Router();

import { assignRoleToUserValidator, removeUserFromRoleValidator } from '../validators/roleValidators.js';
import { assignRoleToUserHandler, removeUserFromRoleHandler } from '../handlers/roleHandler.js';
import { assignRoleToUserPresenter, removeUserFromRolePresenter } from '../presenters/rolePresenter.js';
import { roleController } from '../controllers/roleController.js';
import { tokenSecurity } from '../security/tokenSecurity.js';

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

export {
    roleRoutes
}