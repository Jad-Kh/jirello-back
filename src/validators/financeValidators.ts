import type { UpdateProjectFinanceRequest } from "../handlers/finance/updateProjectFinanceHandler/updateProjectFinanceRequest.js";
import type { GetProjectFinanceSummaryRequest } from "../handlers/finance/getProjectFinanceSummaryHandler/getProjectFinanceSummaryRequest.js";
import { createValidator } from "../helpers/validator.js";
import { FinanceErrorResponses } from "../responses/errors/FinanceErrorResponses.js";
import {
    getProjectFinanceSummaryValidationScheme,
    projectFinanceValidationScheme,
} from "./schemes/financeValidationSchemes.js";

export const getProjectFinanceSummaryValidator = createValidator<GetProjectFinanceSummaryRequest>(
    getProjectFinanceSummaryValidationScheme,
    FinanceErrorResponses.VALIDATION_ERROR,
);

export const updateProjectFinanceValidator = createValidator<UpdateProjectFinanceRequest>(
    projectFinanceValidationScheme,
    FinanceErrorResponses.VALIDATION_ERROR,
);
