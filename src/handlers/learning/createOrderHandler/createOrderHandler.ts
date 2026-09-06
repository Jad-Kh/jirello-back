import { LabOrderQueries } from "../../../database/queries/learning.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateOrderRequest } from "./createOrderRequest.js";
import { performance } from "node:perf_hooks";

import { logger } from "../../../helpers/logger.js";
import { hashLearningRequest } from "../../../services/learning/learningHelpers.js";
import { enqueueLearningEmail } from "../../../infrastructure/learningQueue.js";
import { isDuplicateKey, createOrderAndLedger } from "../../../services/learning/learningService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { LearningErrorResponses } from "../../../responses/errors/LearningErrorResponses.js";
import { LearningSuccessResponses } from "../../../responses/success/LearningSuccessResponses.js";

export async function createOrderHandler(
    request: IRequest<CreateOrderRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    const endpointStartedAt = performance.now();
    const timing = { databaseMs: 0, queueMs: 0, totalMs: 0 };
    try {
        const idempotencyKey = request.header("Idempotency-Key")?.trim();
        if (!idempotencyKey || idempotencyKey.length > 200) {
            response
                .status(400)
                .json({ ...LearningErrorResponses.A_VALID_IDEMPOTENCY_KEY_HEADER_IS_REQUIRED });
            return;
        }
        const value = request.requestModel!;
        let order;
        let replayed = false;
        const databaseStartedAt = performance.now();
        try {
            order = await createOrderAndLedger(request.userId!, value, idempotencyKey);
        } catch (error) {
            if (!isDuplicateKey(error)) throw error;
            const existing = await LabOrderQueries.getLabOrderQuery({
                userId: request.userId!,
                idempotencyKey,
            });
            if (!existing) {
                response.status(409).json({
                    ...LearningErrorResponses.THAT_CLIENT_REFERENCE_ALREADY_BELONGS_TO_ANOTHER_ORDER,
                });
                return;
            }
            if (existing.requestHash !== hashLearningRequest(value)) {
                response.status(409).json({
                    ...LearningErrorResponses.THIS_IDEMPOTENCY_KEY_WAS_ALREADY_USED_WITH_A_DIFFERENT_REQUEST,
                });
                return;
            }
            order = existing;
            replayed = true;
        }
        timing.databaseMs = performance.now() - databaseStartedAt;
        let jobId = null;
        if (!replayed) {
            const queueStartedAt = performance.now();
            jobId =
                (await enqueueLearningEmail({
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                    userId: request.userId!,
                })) ?? null;
            timing.queueMs = performance.now() - queueStartedAt;
        }
        timing.totalMs = performance.now() - endpointStartedAt;
        logger.info(
            {
                requestId: request.id,
                userId: request.userId!,
                orderId: order.id,
                replayed,
                timing,
            },
            "Learning order endpoint timing",
        );
        request.responseModel = { order, replayed, jobId, timing };
        request.successResponse = replayed
            ? LearningSuccessResponses.EXISTING_ORDER_RETURNED
            : LearningSuccessResponses.ORDER_CREATED;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
