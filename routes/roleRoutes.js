import express from 'express'
const roleRoutes = express.Router();

import { assignRoleToUserValidator } from '../validators/roleValidators.js';
import { assignRoleToUserHandler } from '../handlers/roleHandler.js';
import { assignRoleToUserPresenter } from '../presenters/rolePresenter.js';
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

export {
    roleRoutes
}