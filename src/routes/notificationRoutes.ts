import { Router } from "express";
import { endpointForward } from "../helpers/endpointForward.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getNotificationsHandler } from "../handlers/notification/getNotificationsHandler/getNotificationsHandler.js";
import { markNotificationReadHandler } from "../handlers/notification/markNotificationReadHandler/markNotificationReadHandler.js";
import { markAllNotificationsReadHandler } from "../handlers/notification/markAllNotificationsReadHandler/markAllNotificationsReadHandler.js";
import { updateNotificationPreferencesHandler } from "../handlers/notification/updateNotificationPreferencesHandler/updateNotificationPreferencesHandler.js";
import { updateNotificationPreferencesValidator } from "../validators/notificationValidators.js";
import {
    getNotificationsPresenter,
    markAllNotificationsReadPresenter,
    markNotificationReadPresenter,
    updateNotificationPreferencesPresenter,
} from "../presenters/notificationPresenter.js";

const notificationRoutes = Router();

notificationRoutes.use(tokenSecurity);

notificationRoutes.get("/", getNotificationsHandler, getNotificationsPresenter, endpointForward);

notificationRoutes.patch(
    "/:id/read",
    markNotificationReadHandler,
    markNotificationReadPresenter,
    endpointForward,
);

notificationRoutes.patch(
    "/read-all",
    markAllNotificationsReadHandler,
    markAllNotificationsReadPresenter,
    endpointForward,
);

notificationRoutes.patch(
    "/preferences",
    updateNotificationPreferencesValidator,

    updateNotificationPreferencesHandler,
    updateNotificationPreferencesPresenter,
    endpointForward,
);

export { notificationRoutes };
