import { getWorkConfigurationsValidationScheme } from "../../../validators/schemes/workValidationSchemes.js";

export type GetWorkConfigurationsRequest = ReturnType<
    typeof getWorkConfigurationsValidationScheme.validate
>["value"];
