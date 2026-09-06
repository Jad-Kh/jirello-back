import { WorkConfigurationQueries } from "../../../database/queries/work.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetWorkConfigurationsRequest } from "./getWorkConfigurationsRequest.js";
import { performance } from "node:perf_hooks";

import { logger } from "../../../helpers/logger.js";
import { readJsonCache, writeJsonCache } from "../../../infrastructure/redisCache.js";
import { scopedAccess, workConfigurationCacheKey } from "../../../services/work/workService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function getWorkConfigurationsHandler(
    request: IRequest<GetWorkConfigurationsRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    const endpointStartedAt = performance.now();
    try {
        const value = request.requestModel!;
        const accessStartedAt = performance.now();
        if (!(await scopedAccess(request.userId!, value.communityId, value.projectId))) {
            response.status(403).json({ ...WorkErrorResponses.WORK_CONFIGURATION_ACCESS_DENIED });
            return;
        }
        const accessMs = performance.now() - accessStartedAt;
        const cacheStartedAt = performance.now();
        const cacheKey = await workConfigurationCacheKey(value.communityId, value.projectId);
        const cached = await readJsonCache(cacheKey);
        const cacheReadMs = performance.now() - cacheStartedAt;
        if (cached) {
            const totalMs = performance.now() - endpointStartedAt;
            response.setHeader("X-Cache", "HIT");
            logger.info(
                {
                    requestId: request.id,
                    endpoint: "GET /work/configurations",
                    cache: "hit",
                    timing: { accessMs, cacheReadMs, databaseMs: 0, totalMs },
                },
                "Work configuration read timing",
            );
            request.responseModel = cached;
            next();
            return;
        }
        const databaseStartedAt = performance.now();
        const configurations = await WorkConfigurationQueries.getWorkConfigurationsQuery({
            communityId: value.communityId,
            archivedAt: { $exists: false },
            $or: [{ projectId: value.projectId }, { projectId: { $exists: false } }],
        })
            .sort({ projectId: -1, name: 1 })
            .lean();
        const databaseMs = performance.now() - databaseStartedAt;
        const cacheWriteStartedAt = performance.now();
        await writeJsonCache(cacheKey, configurations, 60);
        const cacheWriteMs = performance.now() - cacheWriteStartedAt;
        const totalMs = performance.now() - endpointStartedAt;
        response.setHeader("X-Cache", "MISS");
        logger.info(
            {
                requestId: request.id,
                endpoint: "GET /work/configurations",
                cache: "miss",
                timing: { accessMs, cacheReadMs, databaseMs, cacheWriteMs, totalMs },
            },
            "Work configuration read timing",
        );
        request.responseModel = configurations;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
