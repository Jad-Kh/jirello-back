import type { GetWorkConfigurationsRequest } from "../handlers/work/getWorkConfigurationsHandler/getWorkConfigurationsRequest.js";
import type { CreateWorkConfigurationRequest } from "../handlers/work/createWorkConfigurationHandler/createWorkConfigurationRequest.js";
import type { UpdateWorkConfigurationRequest } from "../handlers/work/updateWorkConfigurationHandler/updateWorkConfigurationRequest.js";
import type { GetWorkTemplatesRequest } from "../handlers/work/getWorkTemplatesHandler/getWorkTemplatesRequest.js";
import type { CreateWorkTemplateRequest } from "../handlers/work/createWorkTemplateHandler/createWorkTemplateRequest.js";
import type { GetSavedWorkViewsRequest } from "../handlers/work/getSavedWorkViewsHandler/getSavedWorkViewsRequest.js";
import type { CreateSavedWorkViewRequest } from "../handlers/work/createSavedWorkViewHandler/createSavedWorkViewRequest.js";
import { createValidator } from "../helpers/validator.js";
import { WorkErrorResponses } from "../responses/errors/WorkErrorResponses.js";
import {
    getWorkConfigurationsValidationScheme,
    getWorkTemplatesValidationScheme,
    getSavedWorkViewsValidationScheme,
    updateWorkConfigurationValidationScheme,
    workConfigurationValidationScheme,
    workTemplateValidationScheme,
    savedWorkViewValidationScheme,
} from "./schemes/workValidationSchemes.js";

export const updateWorkConfigurationValidator = createValidator<UpdateWorkConfigurationRequest>(
    updateWorkConfigurationValidationScheme,
    WorkErrorResponses.VALIDATION_ERROR,
);

export const getWorkConfigurationsValidator = createValidator<GetWorkConfigurationsRequest>(
    getWorkConfigurationsValidationScheme,
    WorkErrorResponses.VALIDATION_ERROR,
);

export const getWorkTemplatesValidator = createValidator<GetWorkTemplatesRequest>(
    getWorkTemplatesValidationScheme,
    WorkErrorResponses.VALIDATION_ERROR,
);

export const getSavedWorkViewsValidator = createValidator<GetSavedWorkViewsRequest>(
    getSavedWorkViewsValidationScheme,
    WorkErrorResponses.VALIDATION_ERROR,
);

export const createWorkConfigurationValidator = createValidator<CreateWorkConfigurationRequest>(
    workConfigurationValidationScheme,
    WorkErrorResponses.VALIDATION_ERROR,
);

export const createWorkTemplateValidator = createValidator<CreateWorkTemplateRequest>(
    workTemplateValidationScheme,
    WorkErrorResponses.VALIDATION_ERROR,
);

export const createSavedWorkViewValidator = createValidator<CreateSavedWorkViewRequest>(
    savedWorkViewValidationScheme,
    WorkErrorResponses.VALIDATION_ERROR,
);
