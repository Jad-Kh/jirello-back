import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.js";
import { Response } from "express";

export type ErrorLogType = {
    message: string,
    code: number,
};

export const handleError = (res: Response, errorType: ErrorLogType, message: string, caller: Function, log: boolean) => {
    if(log)
        prepareErrorLog(message || errorType.message, caller.name);
    return res.status(errorType.code).json(prepareErrorResponse(errorType, message));
};

export const catchError = (error: Error, res: Response, caller: string) => {
    prepareErrorLog(error, caller);
    return res.status(CommonErrorResponses.SERVER_ERROR.code).json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
};