import { configureClientPortalValidationScheme } from "../../../validators/schemes/portalValidationSchemes.js";

export type ConfigureClientPortalRequest = ReturnType<
    typeof configureClientPortalValidationScheme.validate
>["value"];
