import { LabLedgerEntryQueries, LabOrderQueries } from "../../database/queries/learning.js";
import { randomUUID } from "node:crypto";
import type Joi from "joi";

import { getTransactionSession, runInTransaction } from "../../database/transaction.js";
import { hashLearningRequest } from "./learningHelpers.js";
export {
    createOrderValidationScheme,
    runTransactionValidationScheme,
    updateOrderValidationScheme,
} from "../../validators/schemes/learningValidationSchemes.js";

type OrderInput = {
    clientReference: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
};

export const objectIdPattern = /^[a-f\d]{24}$/i;

export function validate(schema: Joi.ObjectSchema, input: unknown) {
    const result = schema.validate(input, { abortEarly: false, stripUnknown: true });
    if (result.error) return { error: result.error.message };
    return { value: result.value };
}
export function isDuplicateKey(error: unknown): boolean {
    return Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);
}
export function serializeOrder(order: unknown): unknown {
    if (order && typeof order === "object" && "toObject" in order && typeof order.toObject === "function") {
        return order.toObject();
    }
    return order;
}
export function findIndexName(plan: unknown): string | undefined {
    if (!plan || typeof plan !== "object") return undefined;
    if ("indexName" in plan && typeof plan.indexName === "string") return plan.indexName;
    for (const child of Object.values(plan)) {
        const match = findIndexName(child);
        if (match) return match;
    }
    return undefined;
}
export async function createOrderAndLedger(userId: string, input: OrderInput, idempotencyKey: string) {
    const requestHash = hashLearningRequest(input);
    const orderNumber = `LAB-${randomUUID()}`;
    return runInTransaction(async () => {
        const [order] = await LabOrderQueries.createLabOrdersQuery(
            [
                {
                    userId,
                    ...input,
                    idempotencyKey,
                    requestHash,
                    orderNumber,
                    total: input.quantity * input.unitPrice,
                    status: "pending",
                    version: 1,
                },
            ],
            { session: getTransactionSession() },
        );
        await LabLedgerEntryQueries.createLabLedgerEntriesQuery(
            [
                {
                    orderId: order._id,
                    userId,
                    amount: order.total,
                    kind: "order-created",
                },
            ],
            { session: getTransactionSession() },
        );
        return order;
    });
}
