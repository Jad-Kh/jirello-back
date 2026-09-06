import Joi from "joi";

export const createOrderValidationScheme = Joi.object({
    clientReference: Joi.string().trim().min(1).max(100).required(),
    itemName: Joi.string().trim().min(1).max(160).required(),
    quantity: Joi.number().integer().min(1).max(1_000).required(),
    unitPrice: Joi.number().min(0).max(1_000_000).precision(2).required(),
});

export const runTransactionValidationScheme = createOrderValidationScheme.keys({
    failAfterFirstWrite: Joi.boolean().default(true),
});

export const updateOrderValidationScheme = Joi.object({
    expectedVersion: Joi.number().integer().min(1).required(),
    itemName: Joi.string().trim().min(1).max(160),
    status: Joi.string().valid("pending", "confirmed", "cancelled"),
})
    .or("itemName", "status")
    .required();

export const runCpuWorkValidationScheme = Joi.object({
    mode: Joi.string().valid("sync", "worker").required(),
    limit: Joi.number().integer().min(10_000).max(2_000_000).default(350_000),
});

export const getOrdersValidationScheme = Joi.object({
    mode: Joi.string().valid("offset", "cursor").default("offset"),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    cursor: Joi.string(),
});

export const seedOrdersValidationScheme = Joi.object({
    count: Joi.number().integer().min(1).max(2_000).default(100),
});
