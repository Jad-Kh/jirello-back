import { getSavedWorkViewsValidationScheme } from "../../../validators/schemes/workValidationSchemes.js";

export type GetSavedWorkViewsRequest = ReturnType<typeof getSavedWorkViewsValidationScheme.validate>["value"];
