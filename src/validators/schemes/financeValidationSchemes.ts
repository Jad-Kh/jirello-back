import Joi from "joi";

export const objectId = Joi.string().hex().length(24);

export const projectFinanceValidationScheme = Joi.object({
    currency: Joi.string().trim().uppercase().length(3).required(),
    budgetCents: Joi.number().integer().min(0),
    defaultBillingRateCents: Joi.number().integer().min(0),
    defaultCostRateCents: Joi.number().integer().min(0),
    billingModel: Joi.string().valid("non-billable", "hourly", "fixed", "retainer").required(),
    retainerCents: Joi.number().integer().min(0),
    memberRates: Joi.array()
        .items(
            Joi.object({
                userId: objectId.required(),
                billingRateCents: Joi.number().integer().min(0),
                costRateCents: Joi.number().integer().min(0),
            }),
        )
        .unique("userId")
        .max(500)
        .default([]),
    visibleToClients: Joi.boolean().default(false),
});

export const getProjectFinanceSummaryValidationScheme = Joi.object({
    from: Joi.date().iso(),
    to: Joi.date().iso(),
});
