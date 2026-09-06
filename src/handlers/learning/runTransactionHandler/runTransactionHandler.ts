import { LabLedgerEntryQueries, LabOrderQueries } from "../../../database/queries/learning.js";
import type { IRequest } from "../../../helpers/api.js";
import type { RunTransactionRequest } from "./runTransactionRequest.js";
import { randomUUID } from "node:crypto";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { hashLearningRequest } from "../../../services/learning/learningHelpers.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";

export async function runTransactionHandler(
    request: IRequest<RunTransactionRequest, "">,
    _response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const operationId = randomUUID();
        const input = value;
        let createdOrderId;
        try {
            await runInTransaction(async () => {
                const [order] = await LabOrderQueries.createLabOrdersQuery(
                    [
                        {
                            userId: request.userId!,
                            clientReference: `transaction-${operationId}`,
                            idempotencyKey: `transaction-${operationId}`,
                            requestHash: hashLearningRequest(input),
                            orderNumber: `TX-${operationId}`,
                            itemName: input.itemName,
                            quantity: input.quantity,
                            unitPrice: input.unitPrice,
                            total: input.quantity * input.unitPrice,
                            status: "pending",
                            version: 1,
                        },
                    ],
                    { session: getTransactionSession() },
                );
                createdOrderId = order.id;
                if (input.failAfterFirstWrite) {
                    throw new Error("LEARNING_SIMULATED_FAILURE");
                }
                await LabLedgerEntryQueries.createLabLedgerEntriesQuery(
                    [
                        {
                            orderId: order._id,
                            userId: request.userId!,
                            amount: order.total,
                            kind: "order-created",
                        },
                    ],
                    { session: getTransactionSession() },
                );
            });
        } catch (error) {
            if (!(error instanceof Error) || error.message !== "LEARNING_SIMULATED_FAILURE") throw error;
        }
        const order = await LabOrderQueries.getLabOrderQuery({ orderNumber: `TX-${operationId}` }).lean();
        const ledger = createdOrderId
            ? await LabLedgerEntryQueries.getLabLedgerEntryQuery({ orderId: createdOrderId }).lean()
            : null;
        const rollbackVerified = input.failAfterFirstWrite && !order && !ledger;
        request.responseModel = {
            committed: !input.failAfterFirstWrite,
            rollbackVerified,
            orderExists: Boolean(order),
            ledgerExists: Boolean(ledger),
            operationId,
        };
        request.successResponse = {
            code: 200,
            message: input.failAfterFirstWrite
                ? "The second step failed; MongoDB rolled both writes back."
                : "Both related writes committed together.",
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
