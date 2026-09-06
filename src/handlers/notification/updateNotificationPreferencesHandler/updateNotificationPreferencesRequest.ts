import { updateNotificationPreferencesValidationScheme } from "../../../validators/schemes/notificationValidationSchemes.js";

export type UpdateNotificationPreferencesRequest = ReturnType<
    typeof updateNotificationPreferencesValidationScheme.validate
>["value"];
