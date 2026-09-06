import { Response } from "express";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.js";

export type ErrorLogType = {
    message: string;
    code: number;
};

export const handleError = (
    res: Response,
    errorType: ErrorLogType,
    message: string,
    caller: Function,
    log: boolean,
) => {
    if (log) prepareErrorLog(message || errorType.message, caller.name);
    return res.status(errorType.code).json(prepareErrorResponse(errorType, message));
};

export const catchError = (error: Error, res: Response, caller: string) => {
    prepareErrorLog(error, caller);
    const databaseError = error as Error & { code?: number; name?: string };
    if (databaseError.code === 11000) {
        return res
            .status(409)
            .json(prepareErrorResponse({ code: 409, message: "Resource already exists." }, null));
    }
    if (databaseError.name === "ValidationError" || databaseError.name === "CastError") {
        return res
            .status(400)
            .json(prepareErrorResponse({ code: 400, message: "Invalid request data." }, null));
    }
    return res
        .status(CommonErrorResponses.SERVER_ERROR.code)
        .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
};
