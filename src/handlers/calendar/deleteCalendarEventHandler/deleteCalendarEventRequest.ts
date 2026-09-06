import { deleteCalendarEventValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type DeleteCalendarEventRequest = ReturnType<
    typeof deleteCalendarEventValidationScheme.validate
>["value"];
