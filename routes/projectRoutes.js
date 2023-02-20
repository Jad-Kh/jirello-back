import express from 'express'
const projectRoutes = express.Router();

import { createProjectValidator } from '../validators/projectValidators.js';
import { createProjectHandler, getProjectsOfCommunityHandler, getProjectsOfCommunityPaginatedHandler } from '../handlers/projectHandler.js';
import { createProjectPresenter, getProjectsOfCommunityPresenter } from '../presenters/projectPresenter.js';
import { projectController } from '../controllers/projectController.js';
import { tokenSecurity } from '../security/tokenSecurity.js';
import { communityByIdValidator } from "../validators/communityValidators.js"

projectRoutes.post(
    "/create-project",
    tokenSecurity,
    createProjectValidator,
    createProjectHandler,
    createProjectPresenter,
    projectController,
);

projectRoutes.get(
    "/get-projects-of-community/:id",
    communityByIdValidator,
    getProjectsOfCommunityHandler,
    getProjectsOfCommunityPresenter,
    projectController
);

projectRoutes.get(
    "/get-projects-of-community-paginated/:id",
    communityByIdValidator,
    getProjectsOfCommunityPaginatedHandler,
    getProjectsOfCommunityPresenter,
    projectController
);

export {
    projectRoutes
}