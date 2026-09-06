import type { GetCalendarsRequest } from "../handlers/calendar/getCalendarsHandler/getCalendarsRequest.js";
import type { CreateCalendarRequest } from "../handlers/calendar/createCalendarHandler/createCalendarRequest.js";
import type { UpdateCalendarRequest } from "../handlers/calendar/updateCalendarHandler/updateCalendarRequest.js";
import type { ArchiveCalendarRequest } from "../handlers/calendar/archiveCalendarHandler/archiveCalendarRequest.js";
import type { GetCalendarEventsRequest } from "../handlers/calendar/getCalendarEventsHandler/getCalendarEventsRequest.js";
import type { CreateCalendarEventRequest } from "../handlers/calendar/createCalendarEventHandler/createCalendarEventRequest.js";
import type { UpdateCalendarEventRequest } from "../handlers/calendar/updateCalendarEventHandler/updateCalendarEventRequest.js";
import type { UpdateCalendarOccurrenceRequest } from "../handlers/calendar/updateCalendarOccurrenceHandler/updateCalendarOccurrenceRequest.js";
import type { DeleteCalendarOccurrenceRequest } from "../handlers/calendar/deleteCalendarOccurrenceHandler/deleteCalendarOccurrenceRequest.js";
import type { RespondToCalendarEventRequest } from "../handlers/calendar/respondToCalendarEventHandler/respondToCalendarEventRequest.js";
import type { DeleteCalendarEventRequest } from "../handlers/calendar/deleteCalendarEventHandler/deleteCalendarEventRequest.js";
import type { GetCalendarAvailabilityRequest } from "../handlers/calendar/getCalendarAvailabilityHandler/getCalendarAvailabilityRequest.js";
import { createValidator } from "../helpers/validator.js";
import { CalendarErrorResponses } from "../responses/errors/CalendarErrorResponses.js";
import {
    archiveCalendarValidationScheme,
    deleteCalendarEventValidationScheme,
    deleteCalendarOccurrenceValidationScheme,
    getCalendarAvailabilityValidationScheme,
    getCalendarsValidationScheme,
    getCalendarEventsValidationScheme,
    updateCalendarValidationScheme,
    updateCalendarEventValidationScheme,
    updateCalendarOccurrenceValidationScheme,
    createCalendarValidationScheme,
    respondToCalendarEventValidationScheme,
    calendarEventValidationScheme,
} from "./schemes/calendarValidationSchemes.js";

export const archiveCalendarValidator = createValidator<ArchiveCalendarRequest>(
    archiveCalendarValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const deleteCalendarEventValidator = createValidator<DeleteCalendarEventRequest>(
    deleteCalendarEventValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const deleteCalendarOccurrenceValidator = createValidator<DeleteCalendarOccurrenceRequest>(
    deleteCalendarOccurrenceValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const getCalendarAvailabilityValidator = createValidator<GetCalendarAvailabilityRequest>(
    getCalendarAvailabilityValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const getCalendarsValidator = createValidator<GetCalendarsRequest>(
    getCalendarsValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const getCalendarEventsValidator = createValidator<GetCalendarEventsRequest>(
    getCalendarEventsValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const updateCalendarValidator = createValidator<UpdateCalendarRequest>(
    updateCalendarValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const updateCalendarEventValidator = createValidator<UpdateCalendarEventRequest>(
    updateCalendarEventValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const updateCalendarOccurrenceValidator = createValidator<UpdateCalendarOccurrenceRequest>(
    updateCalendarOccurrenceValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const createCalendarValidator = createValidator<CreateCalendarRequest>(
    createCalendarValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const respondToCalendarEventValidator = createValidator<RespondToCalendarEventRequest>(
    respondToCalendarEventValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);

export const createCalendarEventValidator = createValidator<CreateCalendarEventRequest>(
    calendarEventValidationScheme,
    CalendarErrorResponses.VALIDATION_ERROR,
);
