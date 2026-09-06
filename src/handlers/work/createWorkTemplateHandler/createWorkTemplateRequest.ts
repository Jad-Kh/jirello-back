import { workTemplateValidationScheme } from "../../../services/work/workService.js";

export type CreateWorkTemplateRequest = ReturnType<typeof workTemplateValidationScheme.validate>["value"];
