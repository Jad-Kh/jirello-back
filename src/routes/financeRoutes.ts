import { Router } from "express";
import { endpointForward } from "../helpers/endpointForward.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getProjectFinanceHandler } from "../handlers/finance/getProjectFinanceHandler/getProjectFinanceHandler.js";
import { updateProjectFinanceHandler } from "../handlers/finance/updateProjectFinanceHandler/updateProjectFinanceHandler.js";
import { getProjectFinanceSummaryHandler } from "../handlers/finance/getProjectFinanceSummaryHandler/getProjectFinanceSummaryHandler.js";
import {
    getProjectFinanceSummaryValidator,
    updateProjectFinanceValidator,
} from "../validators/financeValidators.js";
import {
    getProjectFinancePresenter,
    getProjectFinanceSummaryPresenter,
    updateProjectFinancePresenter,
} from "../presenters/financePresenter.js";

const financeRoutes = Router();

financeRoutes.use(tokenSecurity);

financeRoutes.get(
    "/projects/:projectId",
    getProjectFinanceHandler,
    getProjectFinancePresenter,
    endpointForward,
);

financeRoutes.put(
    "/projects/:projectId",
    updateProjectFinanceValidator,

    updateProjectFinanceHandler,
    updateProjectFinancePresenter,
    endpointForward,
);

financeRoutes.get(
    "/projects/:projectId/summary",
    getProjectFinanceSummaryValidator,

    getProjectFinanceSummaryHandler,
    getProjectFinanceSummaryPresenter,
    endpointForward,
);

export { financeRoutes };
