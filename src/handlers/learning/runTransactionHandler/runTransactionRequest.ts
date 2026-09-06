import { runTransactionValidationScheme } from "../../../services/learning/learningService.js";

export type RunTransactionRequest = ReturnType<typeof runTransactionValidationScheme.validate>["value"];
