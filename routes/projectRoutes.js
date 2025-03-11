import express from 'express'
const projectRoutes = express.Router();

import { createProjectValidator, updateProjectValidator } from '../validators/projectValidators.js';
import { createProjectHandler, getProjectsOfCommunityHandler, getProjectsOfCommunityPaginatedHandler, updateProjectHandler } from '../handlers/projectHandler.js';
import { createProjectPresenter, getProjectsOfCommunityPresenter, updateProjectPresenter } from '../presenters/projectPresenter.js';
import { projectController } from '../controllers/projectController.js';
import { tokenSecurity } from '../security/tokenSecurity.js';
import { communityByIdValidator } from "../validators/communityValidators.js"

projectRoutes.post(
    "/create-project",
    tokenSecurity,
    createProjectValidator,
    createProjectHandler,
    createProjectPresenter,
    projectController
);

projectRoutes.put(
    "/update-project/:id",
    tokenSecurity,
    updateProjectValidator,
    updateProjectHandler,
    updateProjectPresenter,
    projectController
);

projectRoutes.get(
    "/get-projects-of-community/:id",
    tokenSecurity,
    communityByIdValidator,
    getProjectsOfCommunityHandler,
    getProjectsOfCommunityPresenter,
    projectController
);

projectRoutes.get(
    "/get-projects-of-community-paginated/:id",
    tokenSecurity,
    communityByIdValidator,
    getProjectsOfCommunityPaginatedHandler,
    getProjectsOfCommunityPresenter,
    projectController
);

export {
    projectRoutes
}