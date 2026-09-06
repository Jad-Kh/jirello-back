import type { UpdateNotificationPreferencesRequest } from "../handlers/notification/updateNotificationPreferencesHandler/updateNotificationPreferencesRequest.js";
import { createValidator } from "../helpers/validator.js";
import { NotificationErrorResponses } from "../responses/errors/NotificationErrorResponses.js";
import { updateNotificationPreferencesValidationScheme } from "./schemes/notificationValidationSchemes.js";

export const updateNotificationPreferencesValidator = createValidator<UpdateNotificationPreferencesRequest>(
    updateNotificationPreferencesValidationScheme,
    NotificationErrorResponses.VALIDATION_ERROR,
);
