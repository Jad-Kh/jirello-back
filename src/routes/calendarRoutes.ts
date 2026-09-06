import { Router } from "express";
import { endpointForward } from "../helpers/endpointForward.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getCalendarsHandler } from "../handlers/calendar/getCalendarsHandler/getCalendarsHandler.js";
import { createCalendarHandler } from "../handlers/calendar/createCalendarHandler/createCalendarHandler.js";
import { updateCalendarHandler } from "../handlers/calendar/updateCalendarHandler/updateCalendarHandler.js";
import { archiveCalendarHandler } from "../handlers/calendar/archiveCalendarHandler/archiveCalendarHandler.js";
import { getCalendarEventsHandler } from "../handlers/calendar/getCalendarEventsHandler/getCalendarEventsHandler.js";
import { createCalendarEventHandler } from "../handlers/calendar/createCalendarEventHandler/createCalendarEventHandler.js";
import { updateCalendarEventHandler } from "../handlers/calendar/updateCalendarEventHandler/updateCalendarEventHandler.js";
import { updateCalendarOccurrenceHandler } from "../handlers/calendar/updateCalendarOccurrenceHandler/updateCalendarOccurrenceHandler.js";
import { deleteCalendarOccurrenceHandler } from "../handlers/calendar/deleteCalendarOccurrenceHandler/deleteCalendarOccurrenceHandler.js";
import { respondToCalendarEventHandler } from "../handlers/calendar/respondToCalendarEventHandler/respondToCalendarEventHandler.js";
import { deleteCalendarEventHandler } from "../handlers/calendar/deleteCalendarEventHandler/deleteCalendarEventHandler.js";
import { getCalendarAvailabilityHandler } from "../handlers/calendar/getCalendarAvailabilityHandler/getCalendarAvailabilityHandler.js";
import {
    archiveCalendarValidator,
    deleteCalendarEventValidator,
    deleteCalendarOccurrenceValidator,
    getCalendarAvailabilityValidator,
    getCalendarsValidator,
    getCalendarEventsValidator,
    updateCalendarValidator,
    updateCalendarEventValidator,
    updateCalendarOccurrenceValidator,
    createCalendarValidator,
    respondToCalendarEventValidator,
    createCalendarEventValidator,
} from "../validators/calendarValidators.js";
import {
    archiveCalendarPresenter,
    createCalendarEventPresenter,
    createCalendarPresenter,
    deleteCalendarEventPresenter,
    deleteCalendarOccurrencePresenter,
    getCalendarAvailabilityPresenter,
    getCalendarEventsPresenter,
    getCalendarsPresenter,
    respondToCalendarEventPresenter,
    updateCalendarEventPresenter,
    updateCalendarOccurrencePresenter,
    updateCalendarPresenter,
} from "../presenters/calendarPresenter.js";

const calendarRoutes = Router();

calendarRoutes.use(tokenSecurity);

calendarRoutes.get(
    "/calendars",
    getCalendarsValidator,
    getCalendarsHandler,
    getCalendarsPresenter,
    endpointForward,
);

calendarRoutes.post(
    "/calendars",
    createCalendarValidator,
    createCalendarHandler,
    createCalendarPresenter,
    endpointForward,
);

calendarRoutes.patch(
    "/calendars/:id",
    updateCalendarValidator,

    updateCalendarHandler,
    updateCalendarPresenter,
    endpointForward,
);

calendarRoutes.delete(
    "/calendars/:id",
    archiveCalendarValidator,

    archiveCalendarHandler,
    archiveCalendarPresenter,
    endpointForward,
);

calendarRoutes.get(
    "/events",
    getCalendarEventsValidator,
    getCalendarEventsHandler,
    getCalendarEventsPresenter,
    endpointForward,
);

calendarRoutes.post(
    "/events",
    createCalendarEventValidator,
    createCalendarEventHandler,
    createCalendarEventPresenter,
    endpointForward,
);

calendarRoutes.patch(
    "/events/:id",
    updateCalendarEventValidator,

    updateCalendarEventHandler,
    updateCalendarEventPresenter,
    endpointForward,
);

calendarRoutes.patch(
    "/events/:id/occurrences",
    updateCalendarOccurrenceValidator,

    updateCalendarOccurrenceHandler,
    updateCalendarOccurrencePresenter,
    endpointForward,
);

calendarRoutes.delete(
    "/events/:id/occurrences",
    deleteCalendarOccurrenceValidator,

    deleteCalendarOccurrenceHandler,
    deleteCalendarOccurrencePresenter,
    endpointForward,
);

calendarRoutes.post(
    "/events/:id/respond",
    respondToCalendarEventValidator,

    respondToCalendarEventHandler,
    respondToCalendarEventPresenter,
    endpointForward,
);

calendarRoutes.delete(
    "/events/:id",
    deleteCalendarEventValidator,

    deleteCalendarEventHandler,
    deleteCalendarEventPresenter,
    endpointForward,
);

calendarRoutes.get(
    "/availability",
    getCalendarAvailabilityValidator,

    getCalendarAvailabilityHandler,
    getCalendarAvailabilityPresenter,
    endpointForward,
);

export { calendarRoutes };
