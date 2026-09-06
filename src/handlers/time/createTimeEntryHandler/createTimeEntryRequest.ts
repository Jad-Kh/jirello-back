import { timeEntryValidationScheme } from "../../../services/time/timeService.js";

export type CreateTimeEntryRequest = ReturnType<typeof timeEntryValidationScheme.validate>["value"];
