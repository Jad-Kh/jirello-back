import { getWorkloadValidationScheme } from "../../../validators/schemes/timeValidationSchemes.js";

export type GetWorkloadRequest = ReturnType<typeof getWorkloadValidationScheme.validate>["value"];
