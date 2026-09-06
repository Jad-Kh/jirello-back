import { updateWorkConfigurationValidationScheme } from "../../../validators/schemes/workValidationSchemes.js";

export type UpdateWorkConfigurationRequest = ReturnType<
    typeof updateWorkConfigurationValidationScheme.validate
>["value"];
