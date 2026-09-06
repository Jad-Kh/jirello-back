import { workConfigurationValidationScheme } from "../../../services/work/workService.js";

export type CreateWorkConfigurationRequest = ReturnType<
    typeof workConfigurationValidationScheme.validate
>["value"];
