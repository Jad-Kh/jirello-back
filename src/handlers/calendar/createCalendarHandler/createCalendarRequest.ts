import { createCalendarValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type CreateCalendarRequest = ReturnType<typeof createCalendarValidationScheme.validate>["value"];
