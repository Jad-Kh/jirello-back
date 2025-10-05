import { createValidator } from "../helpers/validator.ts";
import { CreateProjectRequest } from "../handlers/project/createProjectHandler/createProjectRequest.ts";
import { APISignature } from "../models/api/APISignature.ts";
import { ProjectErrorResponses } from "../responses/errors/ProjectErrorResponses.ts";
import { ProjectValidationSchemes } from "./schemes/projectValidationSchemes.ts";

export const createProjectValidator = createValidator<CreateProjectRequest>(
    ProjectValidationSchemes.createProjectValidationScheme,
    ProjectErrorResponses.CREATION_ERROR
);

export const updateProjectValidator = createValidator<APISignature>(
    ProjectValidationSchemes.updateProjectValidationScheme,
    ProjectErrorResponses.PROJECT_UPDATE_ERROR,
    true
);