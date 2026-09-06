import { updateCalendarValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type UpdateCalendarRequest = ReturnType<typeof updateCalendarValidationScheme.validate>["value"];
