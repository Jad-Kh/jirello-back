import { updateTimeEntryValidationScheme } from "../../../validators/schemes/timeValidationSchemes.js";

export type UpdateTimeEntryRequest = ReturnType<typeof updateTimeEntryValidationScheme.validate>["value"];
