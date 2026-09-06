import { updateCalendarOccurrenceValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type UpdateCalendarOccurrenceRequest = ReturnType<
    typeof updateCalendarOccurrenceValidationScheme.validate
>["value"];
