import { LabOrderQueries } from "../../../database/queries/learning.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetOrdersRequest } from "./getOrdersRequest.js";
import { performance } from "node:perf_hooks";
import { Types } from "mongoose";

import { decodeLearningCursor, encodeLearningCursor } from "../../../services/learning/learningHelpers.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { LearningErrorResponses } from "../../../responses/errors/LearningErrorResponses.js";
import { LearningSuccessResponses } from "../../../responses/success/LearningSuccessResponses.js";

export async function getOrdersHandler(
    request: IRequest<GetOrdersRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const { mode, page, limit, cursor } = value;
        const startedAt = performance.now();
        if (mode === "offset") {
            const [items, total] = await Promise.all([
                LabOrderQueries.getLabOrdersQuery({ userId: request.userId! })
                    .sort({ createdAt: -1, _id: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean(),
                LabOrderQueries.countLabOrdersQuery({ userId: request.userId! }),
            ]);
            request.responseModel = {
                mode,
                items,
                page,
                total,
                hasMore: page * limit < total,
                databaseMs: performance.now() - startedAt,
            };
            request.successResponse = LearningSuccessResponses.OFFSET_PAGE_LOADED_WITH_SKIP_LIMIT;
            next();
            return;
        }
        let cursorFilter = {};
        if (cursor) {
            try {
                const decoded = decodeLearningCursor(cursor);
                const createdAt = new Date(decoded.createdAt);
                cursorFilter = {
                    $or: [
                        { createdAt: { $lt: createdAt } },
                        { createdAt, _id: { $lt: new Types.ObjectId(decoded.id) } },
                    ],
                };
            } catch {
                response.status(400).json({ ...LearningErrorResponses.INVALID_PAGINATION_CURSOR });
                return;
            }
        }
        const candidates = await LabOrderQueries.getLabOrdersQuery({
            userId: request.userId!,
            ...cursorFilter,
        })
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit + 1)
            .lean();
        const hasMore = candidates.length > limit;
        const items = candidates.slice(0, limit);
        const last = items.at(-1);
        const nextCursor = hasMore && last ? encodeLearningCursor(last.createdAt, String(last._id)) : null;
        request.responseModel = {
            mode,
            items,
            nextCursor,
            hasMore,
            databaseMs: performance.now() - startedAt,
        };
        request.successResponse = LearningSuccessResponses.CURSOR_PAGE_LOADED_WITH_AN_INDEXED_RANGE_QUERY;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
