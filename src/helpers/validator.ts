import { handleError } from "./errorLogging.js";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { ErrorResponse } from "../models/api/ErrorResponse.js";
import { ObjectSchema } from "joi";
import { IRequest, IResponse } from "./api.js";
import { NextFunction } from "express";

export const createValidator = <T>(
    validationScheme: ObjectSchema,
    errorResponse: ErrorResponse,
    hasId = false
) => async (req: IRequest<T, "">, res: IResponse, next: NextFunction): Promise<IResponse | void> => {
    try {
        if (hasId && !req.params.id) {
            return handleError(
                res,
                CommonErrorResponses.NOT_FOUND,
                "",
                createValidator,
                false
            );
        }
        const dataToValidate = { ...req.body, ...(hasId ? { id: req.params.id } : {}) };
        const { error, value } = validationScheme.validate(dataToValidate);
        if (error) {
            return res.status(errorResponse.code).json(prepareErrorResponse(errorResponse, error?.message));
        }
        req.requestModel = value as T;
        return next();
    } catch (err) {
        return handleError(
            res,
            CommonErrorResponses.SERVER_ERROR,
            "",
            createValidator,
            true
        );
    }
};