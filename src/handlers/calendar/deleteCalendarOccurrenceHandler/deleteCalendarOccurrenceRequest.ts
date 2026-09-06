import { deleteCalendarOccurrenceValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type DeleteCalendarOccurrenceRequest = ReturnType<
    typeof deleteCalendarOccurrenceValidationScheme.validate
>["value"];
