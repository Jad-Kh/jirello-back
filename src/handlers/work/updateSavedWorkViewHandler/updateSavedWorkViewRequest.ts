import { savedWorkViewValidationScheme } from "../../../services/work/workService.js";

export type UpdateSavedWorkViewRequest = ReturnType<typeof savedWorkViewValidationScheme.validate>["value"];
