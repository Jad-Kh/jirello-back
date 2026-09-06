import { createPresenter } from "../helpers/presenting.js";
import { NotificationResponse } from "../models/notification/NotificationResponse.js";
import { UserNotificationResponse } from "../models/user/UserNotificationResponse.js";
import { NotificationSuccessResponses } from "../responses/success/NotificationSuccessResponses.js";

export const getNotificationsPresenter = createPresenter(NotificationSuccessResponses.NOTIFICATIONS_LOADED);
export const markNotificationReadPresenter = createPresenter(
    NotificationSuccessResponses.NOTIFICATION_MARKED_AS_READ,
    NotificationResponse,
);
export const markAllNotificationsReadPresenter = createPresenter(
    NotificationSuccessResponses.ALL_NOTIFICATIONS_MARKED_AS_READ,
);
export const updateNotificationPreferencesPresenter = createPresenter(
    NotificationSuccessResponses.NOTIFICATION_PREFERENCES_UPDATED,
    UserNotificationResponse,
);
