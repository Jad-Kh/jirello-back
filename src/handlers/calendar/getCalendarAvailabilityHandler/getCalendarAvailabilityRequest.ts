import { getCalendarAvailabilityValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type GetCalendarAvailabilityRequest = ReturnType<
    typeof getCalendarAvailabilityValidationScheme.validate
>["value"];
