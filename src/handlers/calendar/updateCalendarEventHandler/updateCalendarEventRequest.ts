import { updateCalendarEventValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type UpdateCalendarEventRequest = ReturnType<
    typeof updateCalendarEventValidationScheme.validate
>["value"];
