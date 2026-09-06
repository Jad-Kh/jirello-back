import { LabOrderQueries } from "../../../database/queries/learning.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateOrderRequest } from "./updateOrderRequest.js";

import { invalidateOrderCache } from "../../../infrastructure/learningQueue.js";
import { objectIdPattern, serializeOrder } from "../../../services/learning/learningService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { LearningErrorResponses } from "../../../responses/errors/LearningErrorResponses.js";

export async function updateOrderHandler(
    request: IRequest<UpdateOrderRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        if (!objectIdPattern.test(request.params.id)) {
            response.status(400).json({ ...LearningErrorResponses.INVALID_ORDER_ID });
            return;
        }
        const value = request.requestModel!;
        const { expectedVersion, ...updates } = value;
        const order = await LabOrderQueries.updateLabOrderQuery(
            { _id: request.params.id, userId: request.userId!, version: expectedVersion },
            { $set: updates, $inc: { version: 1 } },
            { new: true, runValidators: true },
        );
        if (!order) {
            const current = await LabOrderQueries.getLabOrderQuery({
                _id: request.params.id,
                userId: request.userId!,
            })
                .select("version")
                .lean();
            if (!current) {
                response.status(404).json({ ...LearningErrorResponses.ORDER_NOT_FOUND });
                return;
            }
            response.status(409).json({
                ...LearningErrorResponses.VERSION_CONFLICT_ANOTHER_UPDATE_WON_THE_RACE,
                data: { expectedVersion, currentVersion: current.version },
            });
            return;
        }
        await invalidateOrderCache(`${request.userId!}:${request.params.id}`);
        request.responseModel = { order: serializeOrder(order) };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
