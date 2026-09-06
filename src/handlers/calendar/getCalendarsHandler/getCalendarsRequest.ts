import { getCalendarsValidationScheme } from "../../../validators/schemes/calendarValidationSchemes.js";

export type GetCalendarsRequest = ReturnType<typeof getCalendarsValidationScheme.validate>["value"];
