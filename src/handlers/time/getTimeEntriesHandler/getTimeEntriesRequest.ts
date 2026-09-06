import { getTimeEntriesValidationScheme } from "../../../validators/schemes/timeValidationSchemes.js";

export type GetTimeEntriesRequest = ReturnType<typeof getTimeEntriesValidationScheme.validate>["value"];
