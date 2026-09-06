import { Request, Router } from "express";
import { createProjectHandler } from "../handlers/project/createProjectHandler/createProjectHandler.js";
import { getProjectsOfCommunityHandler } from "../handlers/project/getProjectsOfCommunityHandler/getProjectsOfCommunityHandler.js";
import { updateProjectHandler } from "../handlers/project/updateProjectHandler/updateProjectHandler.js";
import { endpointForward } from "../helpers/endpointForward.js";
import { Permissions } from "../helpers/permissions.js";
import {
    createProjectPresenter,
    getUserProjectsPresenter,
    updateProjectPresenter,
} from "../presenters/projectPresenter.js";
import { requireCommunityPermission } from "../security/permissionSecurity.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { createProjectValidator, updateProjectValidator } from "../validators/projectValidators.js";
import { getUserByIdValidator } from "../validators/userValidators.js";

const projectRoutes = Router();

const bodyCommunityId = (request: Request): string | undefined => request.body?.communityId;

const parameterCommunityId = (request: Request): string | undefined => {
    const id = request.params.id;
    return Array.isArray(id) ? id[0] : id;
};

projectRoutes.use(tokenSecurity);
projectRoutes.post(
    "/create-project",
    createProjectValidator,
    requireCommunityPermission(
        "projects",
        [Permissions.CREATE_OWN, Permissions.CREATE_OTHER],
        bodyCommunityId,
    ),
    createProjectHandler,
    createProjectPresenter,
    endpointForward,
);
projectRoutes.put(
    "/update-project/:id",
    updateProjectValidator,
    requireCommunityPermission("projects", [Permissions.EDIT_OWN, Permissions.EDIT_OTHER]),
    updateProjectHandler,
    updateProjectPresenter,
    endpointForward,
);
projectRoutes.get(
    "/get-projects-of-community/:id",
    getUserByIdValidator,
    requireCommunityPermission(
        "projects",
        [Permissions.READ_OWN, Permissions.READ_OTHER],
        parameterCommunityId,
    ),
    getProjectsOfCommunityHandler,
    getUserProjectsPresenter,
    endpointForward,
);

export { projectRoutes };
