import { updateOrderValidationScheme } from "../../../services/learning/learningService.js";

export type UpdateOrderRequest = ReturnType<typeof updateOrderValidationScheme.validate>["value"];
