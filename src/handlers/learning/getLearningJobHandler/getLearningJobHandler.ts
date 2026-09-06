import { learningJobStatus } from "../../../infrastructure/learningQueue.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";

export async function getLearningJobHandler(
    request: ExpressRequest<{ jobId: string }>,
    _response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const status = await learningJobStatus(request.params.jobId);
        request.responseModel = status;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
