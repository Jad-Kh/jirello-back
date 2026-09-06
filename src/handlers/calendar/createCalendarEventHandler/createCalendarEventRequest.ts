import { calendarEventValidationScheme } from "../../../services/calendar/calendarService.js";

export type CreateCalendarEventRequest = ReturnType<typeof calendarEventValidationScheme.validate>["value"];
