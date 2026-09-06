import { respondToCalendarEventValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type RespondToCalendarEventRequest = ReturnType<
    typeof respondToCalendarEventValidationScheme.validate
>["value"];
