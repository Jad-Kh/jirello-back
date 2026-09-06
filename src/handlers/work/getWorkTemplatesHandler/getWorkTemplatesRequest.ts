import { getWorkTemplatesValidationScheme } from "../../../validators/schemes/workValidationSchemes.js";

export type GetWorkTemplatesRequest = ReturnType<typeof getWorkTemplatesValidationScheme.validate>["value"];
