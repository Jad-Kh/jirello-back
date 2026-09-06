import { seedOrdersValidationScheme } from "../../../validators/schemes/learningValidationSchemes.js";

export type SeedOrdersRequest = ReturnType<typeof seedOrdersValidationScheme.validate>["value"];
