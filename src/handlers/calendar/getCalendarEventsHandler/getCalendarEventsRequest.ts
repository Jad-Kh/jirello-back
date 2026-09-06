import { getCalendarEventsValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type GetCalendarEventsRequest = ReturnType<typeof getCalendarEventsValidationScheme.validate>["value"];
