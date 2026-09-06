import { LabOrderQueries } from "../../../database/queries/learning.js";

import { findIndexName } from "../../../services/learning/learningService.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";

type QueryExplanation = {
    queryPlanner: { winningPlan: unknown };
    executionStats: {
        totalKeysExamined: number;
        totalDocsExamined: number;
        nReturned: number;
        executionTimeMillis: number;
    };
};

export async function explainOrderIndexHandler(
    request: ExpressRequest,
    _response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const explanation = (await LabOrderQueries.getLabOrdersQuery({ userId: request.userId! })
            .sort({ createdAt: -1, _id: -1 })
            .limit(20)
            .lean()
            .explain("executionStats")) as unknown as QueryExplanation;
        request.responseModel = {
            indexName: findIndexName(explanation.queryPlanner.winningPlan),
            totalKeysExamined: explanation.executionStats.totalKeysExamined,
            totalDocsExamined: explanation.executionStats.totalDocsExamined,
            returned: explanation.executionStats.nReturned,
            executionMs: explanation.executionStats.executionTimeMillis,
            tradeoff:
                "The compound index speeds this filtered/sorted read, but consumes storage and adds work to every write.",
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
