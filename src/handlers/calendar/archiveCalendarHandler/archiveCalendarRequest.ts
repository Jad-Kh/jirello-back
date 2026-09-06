import { archiveCalendarValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type ArchiveCalendarRequest = ReturnType<typeof archiveCalendarValidationScheme.validate>["value"];
