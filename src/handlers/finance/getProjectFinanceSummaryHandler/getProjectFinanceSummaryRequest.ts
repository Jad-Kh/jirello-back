import { getProjectFinanceSummaryValidationScheme } from "../../../validators/schemes/financeValidationSchemes.js";

export type GetProjectFinanceSummaryRequest = ReturnType<
    typeof getProjectFinanceSummaryValidationScheme.validate
>["value"];
