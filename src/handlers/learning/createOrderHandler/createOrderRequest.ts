import { createOrderValidationScheme } from "../../../services/learning/learningService.js";

export type CreateOrderRequest = ReturnType<typeof createOrderValidationScheme.validate>["value"];
