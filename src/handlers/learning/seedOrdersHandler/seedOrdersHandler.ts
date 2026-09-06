import { LabOrderQueries } from "../../../database/queries/learning.js";
import type { IRequest } from "../../../helpers/api.js";
import type { SeedOrdersRequest } from "./seedOrdersRequest.js";
import { randomUUID } from "node:crypto";
import { Types } from "mongoose";

import { hashLearningRequest } from "../../../services/learning/learningHelpers.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";

export async function seedOrdersHandler(
    request: IRequest<SeedOrdersRequest, "">,
    _response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const batchId = randomUUID();
        const orders = Array.from({ length: value.count }, (_, index) => ({
            userId: new Types.ObjectId(request.userId!),
            clientReference: `seed-${batchId}-${index}`,
            idempotencyKey: `seed-${batchId}-${index}`,
            requestHash: hashLearningRequest({ batchId, index }),
            orderNumber: `SEED-${batchId}-${index}`,
            itemName: `Pagination sample ${index + 1}`,
            quantity: (index % 5) + 1,
            unitPrice: (index % 20) + 1,
            total: ((index % 5) + 1) * ((index % 20) + 1),
            status: "pending",
            version: 1,
        }));
        await LabOrderQueries.createManyLabOrdersQuery(orders, { ordered: true });
        request.responseModel = { count: orders.length };
        request.successResponse = { code: 201, message: `${orders.length} indexed sample orders created.` };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
