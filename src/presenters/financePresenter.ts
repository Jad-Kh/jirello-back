import { createPresenter } from "../helpers/presenting.js";
import { ProjectFinanceResponse } from "../models/finance/ProjectFinanceResponse.js";
import { FinanceSuccessResponses } from "../responses/success/FinanceSuccessResponses.js";

export const getProjectFinancePresenter = createPresenter(
    FinanceSuccessResponses.PROJECT_FINANCIAL_SETTINGS_LOADED,
    ProjectFinanceResponse,
);
export const updateProjectFinancePresenter = createPresenter(
    FinanceSuccessResponses.PROJECT_FINANCIAL_SETTINGS_UPDATED,
    ProjectFinanceResponse,
);
export const getProjectFinanceSummaryPresenter = createPresenter(
    FinanceSuccessResponses.PROJECT_FINANCIAL_SUMMARY_LOADED,
);
