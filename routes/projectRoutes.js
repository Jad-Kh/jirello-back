import express from 'express'
const projectRoutes = express.Router();

import { createProjectValidator } from '../validators/projectValidators.js';
import { createProjectHandler } from '../handlers/projectHandler.js';
import { createProjectPresenter } from '../presenters/projectPresenter.js';
import { projectController } from '../controllers/projectController.js';
import { tokenSecurity } from '../security/tokenSecurity.js';

projectRoutes.post(
    "/create-project",
    tokenSecurity,
    createProjectValidator,
    createProjectHandler,
    createProjectPresenter,
    projectController,
);


export {
    projectRoutes
}