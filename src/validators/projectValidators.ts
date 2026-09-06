import { CreateProjectRequest } from "../handlers/project/createProjectHandler/createProjectRequest.js";
import { UpdateProjectRequest } from "../handlers/project/updateProjectHandler/updateProjectRequest.js";
import { createValidator } from "../helpers/validator.js";
import { ProjectErrorResponses } from "../responses/errors/ProjectErrorResponses.js";
import { ProjectValidationSchemes } from "./schemes/projectValidationSchemes.js";

export const createProjectValidator = createValidator<CreateProjectRequest>(
    ProjectValidationSchemes.createProjectValidationScheme,
    ProjectErrorResponses.CREATION_ERROR,
);

export const updateProjectValidator = createValidator<UpdateProjectRequest>(
    ProjectValidationSchemes.updateProjectValidationScheme,
    ProjectErrorResponses.PROJECT_UPDATE_ERROR,
    true,
);
