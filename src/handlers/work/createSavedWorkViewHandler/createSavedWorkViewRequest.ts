import { savedWorkViewValidationScheme } from "../../../services/work/workService.js";

export type CreateSavedWorkViewRequest = ReturnType<typeof savedWorkViewValidationScheme.validate>["value"];
