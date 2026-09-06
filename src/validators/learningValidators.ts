import type { RunTransactionRequest } from "../handlers/learning/runTransactionHandler/runTransactionRequest.js";
import type { CreateOrderRequest } from "../handlers/learning/createOrderHandler/createOrderRequest.js";
import type { SeedOrdersRequest } from "../handlers/learning/seedOrdersHandler/seedOrdersRequest.js";
import type { GetOrdersRequest } from "../handlers/learning/getOrdersHandler/getOrdersRequest.js";
import type { UpdateOrderRequest } from "../handlers/learning/updateOrderHandler/updateOrderRequest.js";
import type { RunCpuWorkRequest } from "../handlers/learning/runCpuWorkHandler/runCpuWorkRequest.js";
import { createValidator } from "../helpers/validator.js";
import { LearningErrorResponses } from "../responses/errors/LearningErrorResponses.js";
import {
    getOrdersValidationScheme,
    seedOrdersValidationScheme,
    updateOrderValidationScheme,
    createOrderValidationScheme,
    runTransactionValidationScheme,
    runCpuWorkValidationScheme,
} from "./schemes/learningValidationSchemes.js";

export const getOrdersValidator = createValidator<GetOrdersRequest>(
    getOrdersValidationScheme,
    LearningErrorResponses.VALIDATION_ERROR,
);

export const seedOrdersValidator = createValidator<SeedOrdersRequest>(
    seedOrdersValidationScheme,
    LearningErrorResponses.VALIDATION_ERROR,
);

export const updateOrderValidator = createValidator<UpdateOrderRequest>(
    updateOrderValidationScheme,
    LearningErrorResponses.VALIDATION_ERROR,
);

export const createOrderValidator = createValidator<CreateOrderRequest>(
    createOrderValidationScheme,
    LearningErrorResponses.VALIDATION_ERROR,
);

export const runTransactionValidator = createValidator<RunTransactionRequest>(
    runTransactionValidationScheme,
    LearningErrorResponses.VALIDATION_ERROR,
);

export const runCpuWorkValidator = createValidator<RunCpuWorkRequest>(
    runCpuWorkValidationScheme,
    LearningErrorResponses.VALIDATION_ERROR,
);
