import { Router } from "express";
import { endpointForward } from "../helpers/endpointForward.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getWorkConfigurationsHandler } from "../handlers/work/getWorkConfigurationsHandler/getWorkConfigurationsHandler.js";
import { createWorkConfigurationHandler } from "../handlers/work/createWorkConfigurationHandler/createWorkConfigurationHandler.js";
import { updateWorkConfigurationHandler } from "../handlers/work/updateWorkConfigurationHandler/updateWorkConfigurationHandler.js";
import { archiveWorkConfigurationHandler } from "../handlers/work/archiveWorkConfigurationHandler/archiveWorkConfigurationHandler.js";
import { getWorkTemplatesHandler } from "../handlers/work/getWorkTemplatesHandler/getWorkTemplatesHandler.js";
import { createWorkTemplateHandler } from "../handlers/work/createWorkTemplateHandler/createWorkTemplateHandler.js";
import { deleteWorkTemplateHandler } from "../handlers/work/deleteWorkTemplateHandler/deleteWorkTemplateHandler.js";
import { getSavedWorkViewsHandler } from "../handlers/work/getSavedWorkViewsHandler/getSavedWorkViewsHandler.js";
import { createSavedWorkViewHandler } from "../handlers/work/createSavedWorkViewHandler/createSavedWorkViewHandler.js";
import { updateSavedWorkViewHandler } from "../handlers/work/updateSavedWorkViewHandler/updateSavedWorkViewHandler.js";
import { deleteSavedWorkViewHandler } from "../handlers/work/deleteSavedWorkViewHandler/deleteSavedWorkViewHandler.js";
import {
    getWorkConfigurationsValidator,
    getWorkTemplatesValidator,
    getSavedWorkViewsValidator,
    updateWorkConfigurationValidator,
    createWorkConfigurationValidator,
    createWorkTemplateValidator,
    createSavedWorkViewValidator,
} from "../validators/workValidators.js";
import {
    archiveWorkConfigurationPresenter,
    createSavedWorkViewPresenter,
    createWorkConfigurationPresenter,
    createWorkTemplatePresenter,
    deleteSavedWorkViewPresenter,
    deleteWorkTemplatePresenter,
    getSavedWorkViewsPresenter,
    getWorkConfigurationsPresenter,
    getWorkTemplatesPresenter,
    updateSavedWorkViewPresenter,
    updateWorkConfigurationPresenter,
} from "../presenters/workPresenter.js";

const workRoutes = Router();

workRoutes.use(tokenSecurity);

workRoutes.get(
    "/configurations",
    getWorkConfigurationsValidator,
    getWorkConfigurationsHandler,
    getWorkConfigurationsPresenter,
    endpointForward,
);

workRoutes.post(
    "/configurations",
    createWorkConfigurationValidator,
    createWorkConfigurationHandler,
    createWorkConfigurationPresenter,
    endpointForward,
);

workRoutes.patch(
    "/configurations/:id",
    updateWorkConfigurationValidator,
    updateWorkConfigurationHandler,
    updateWorkConfigurationPresenter,
    endpointForward,
);

workRoutes.delete(
    "/configurations/:id",
    archiveWorkConfigurationHandler,
    archiveWorkConfigurationPresenter,
    endpointForward,
);

workRoutes.get(
    "/templates",
    getWorkTemplatesValidator,
    getWorkTemplatesHandler,
    getWorkTemplatesPresenter,
    endpointForward,
);

workRoutes.post(
    "/templates",
    createWorkTemplateValidator,
    createWorkTemplateHandler,
    createWorkTemplatePresenter,
    endpointForward,
);

workRoutes.delete("/templates/:id", deleteWorkTemplateHandler, deleteWorkTemplatePresenter, endpointForward);

workRoutes.get(
    "/views",
    getSavedWorkViewsValidator,
    getSavedWorkViewsHandler,
    getSavedWorkViewsPresenter,
    endpointForward,
);

workRoutes.post(
    "/views",
    createSavedWorkViewValidator,
    createSavedWorkViewHandler,
    createSavedWorkViewPresenter,
    endpointForward,
);

workRoutes.patch("/views/:id", updateSavedWorkViewHandler, updateSavedWorkViewPresenter, endpointForward);

workRoutes.delete("/views/:id", deleteSavedWorkViewHandler, deleteSavedWorkViewPresenter, endpointForward);

export { workRoutes };
