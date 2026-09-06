import { reviewTimeEntryValidationScheme } from "../../../validators/schemes/timeValidationSchemes.js";

export type ReviewTimeEntryRequest = ReturnType<typeof reviewTimeEntryValidationScheme.validate>["value"];
