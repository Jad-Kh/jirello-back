import { projectFinanceValidationScheme } from "../../../services/finance/financeService.js";

export type UpdateProjectFinanceRequest = ReturnType<typeof projectFinanceValidationScheme.validate>["value"];
