import { LabOrderQueries } from "../../../database/queries/learning.js";
import { performance } from "node:perf_hooks";

import { logger } from "../../../helpers/logger.js";
import { readOrderCache, writeOrderCache } from "../../../infrastructure/learningQueue.js";
import { objectIdPattern } from "../../../services/learning/learningService.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { LearningErrorResponses } from "../../../responses/errors/LearningErrorResponses.js";
import { LearningSuccessResponses } from "../../../responses/success/LearningSuccessResponses.js";

export async function getOrderHandler(
    request: ExpressRequest<{ id: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    const endpointStartedAt = performance.now();
    try {
        if (!objectIdPattern.test(request.params.id)) {
            response.status(400).json({ ...LearningErrorResponses.INVALID_ORDER_ID });
            return;
        }
        const cacheKey = `${request.userId!}:${request.params.id}`;
        const cacheStartedAt = performance.now();
        const cached = await readOrderCache(cacheKey);
        const cacheMs = performance.now() - cacheStartedAt;
        if (cached) {
            const timing = { cacheMs, databaseMs: 0, totalMs: performance.now() - endpointStartedAt };
            logger.info({ requestId: request.id, cache: "hit", timing }, "Learning order read timing");
            request.responseModel = { order: JSON.parse(cached), cache: "hit", timing };
            request.successResponse = LearningSuccessResponses.ORDER_LOADED_FROM_REDIS;
            next();
            return;
        }
        const databaseStartedAt = performance.now();
        const order = await LabOrderQueries.getLabOrderQuery({
            _id: request.params.id,
            userId: request.userId!,
        }).lean();
        const databaseMs = performance.now() - databaseStartedAt;
        if (!order) {
            response.status(404).json({ ...LearningErrorResponses.ORDER_NOT_FOUND });
            return;
        }
        await writeOrderCache(cacheKey, order);
        const timing = { cacheMs, databaseMs, totalMs: performance.now() - endpointStartedAt };
        logger.info({ requestId: request.id, cache: "miss", timing }, "Learning order read timing");
        request.responseModel = { order, cache: "miss", timing };
        request.successResponse =
            LearningSuccessResponses.CACHE_MISS_ORDER_LOADED_FROM_MONGODB_AND_CACHED_FOR_60_SECONDS;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
