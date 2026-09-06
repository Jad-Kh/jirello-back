import { createPresenter } from "../helpers/presenting.js";
import { CalendarEventResponse } from "../models/calendar/CalendarEventResponse.js";
import { CalendarResponse } from "../models/calendar/CalendarResponse.js";
import { CalendarsResponse } from "../models/calendar/CalendarsResponse.js";
import { CalendarSuccessResponses } from "../responses/success/CalendarSuccessResponses.js";

export const archiveCalendarPresenter = createPresenter(CalendarSuccessResponses.CALENDAR_ARCHIVED);
export const deleteCalendarEventPresenter = createPresenter(CalendarSuccessResponses.CALENDAR_EVENT_DELETED);
export const deleteCalendarOccurrencePresenter = createPresenter(
    CalendarSuccessResponses.CALENDAR_OCCURRENCE_DELETED,
);
export const getCalendarAvailabilityPresenter = createPresenter(CalendarSuccessResponses.AVAILABILITY_LOADED);
export const getCalendarsPresenter = createPresenter(
    CalendarSuccessResponses.CALENDARS_LOADED,
    CalendarsResponse,
);
export const getCalendarEventsPresenter = createPresenter(CalendarSuccessResponses.CALENDAR_LOADED);
export const updateCalendarPresenter = createPresenter(
    CalendarSuccessResponses.CALENDAR_UPDATED,
    CalendarResponse,
);
export const updateCalendarEventPresenter = createPresenter(
    CalendarSuccessResponses.CALENDAR_EVENT_UPDATED,
    CalendarEventResponse,
);
export const updateCalendarOccurrencePresenter = createPresenter(
    CalendarSuccessResponses.CALENDAR_OCCURRENCE_UPDATED,
);
export const createCalendarPresenter = createPresenter(
    CalendarSuccessResponses.CALENDAR_CREATED,
    CalendarResponse,
);
export const respondToCalendarEventPresenter = createPresenter(
    CalendarSuccessResponses.CALENDAR_INVITATION_RESPONSE_SAVED,
    CalendarEventResponse,
);
export const createCalendarEventPresenter = createPresenter(
    CalendarSuccessResponses.CALENDAR_EVENT_CREATED,
    CalendarEventResponse,
);
