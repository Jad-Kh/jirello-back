import { getOrdersValidationScheme } from "../../../validators/schemes/learningValidationSchemes.js";

export type GetOrdersRequest = ReturnType<typeof getOrdersValidationScheme.validate>["value"];
