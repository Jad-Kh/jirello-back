import { createPresenter } from "../helpers/presenting.js";
import { SavedWorkViewResponse } from "../models/work/SavedWorkViewResponse.js";
import { SavedWorkViewsResponse } from "../models/work/SavedWorkViewsResponse.js";
import { WorkConfigurationResponse } from "../models/work/WorkConfigurationResponse.js";
import { WorkConfigurationsResponse } from "../models/work/WorkConfigurationsResponse.js";
import { WorkTemplateResponse } from "../models/work/WorkTemplateResponse.js";
import { WorkTemplatesResponse } from "../models/work/WorkTemplatesResponse.js";
import { WorkSuccessResponses } from "../responses/success/WorkSuccessResponses.js";

export const getWorkConfigurationsPresenter = createPresenter(
    WorkSuccessResponses.WORK_CONFIGURATIONS_LOADED,
    WorkConfigurationsResponse,
);
export const createWorkConfigurationPresenter = createPresenter(
    WorkSuccessResponses.WORK_CONFIGURATION_CREATED,
    WorkConfigurationResponse,
);
export const updateWorkConfigurationPresenter = createPresenter(
    WorkSuccessResponses.WORK_CONFIGURATION_UPDATED,
    WorkConfigurationResponse,
);
export const archiveWorkConfigurationPresenter = createPresenter(
    WorkSuccessResponses.WORK_CONFIGURATION_ARCHIVED,
);
export const getWorkTemplatesPresenter = createPresenter(
    WorkSuccessResponses.WORK_TEMPLATES_LOADED,
    WorkTemplatesResponse,
);
export const createWorkTemplatePresenter = createPresenter(
    WorkSuccessResponses.WORK_TEMPLATE_CREATED,
    WorkTemplateResponse,
);
export const deleteWorkTemplatePresenter = createPresenter(WorkSuccessResponses.WORK_TEMPLATE_DELETED);
export const getSavedWorkViewsPresenter = createPresenter(
    WorkSuccessResponses.SAVED_VIEWS_LOADED,
    SavedWorkViewsResponse,
);
export const createSavedWorkViewPresenter = createPresenter(
    WorkSuccessResponses.SAVED_VIEW_CREATED,
    SavedWorkViewResponse,
);
export const updateSavedWorkViewPresenter = createPresenter(
    WorkSuccessResponses.SAVED_VIEW_UPDATED,
    SavedWorkViewResponse,
);
export const deleteSavedWorkViewPresenter = createPresenter(WorkSuccessResponses.SAVED_VIEW_DELETED);
