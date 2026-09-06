import { NextFunction } from "express";
import { ObjectSchema } from "joi";
import { ErrorResponse } from "../models/api/ErrorResponse.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.js";
import { IRequest, IResponse } from "./api.js";
import { handleError } from "./errorLogging.js";

export const createValidator =
    <T>(validationScheme: ObjectSchema, errorResponse: ErrorResponse, hasId = false) =>
    async (req: IRequest<T, "">, res: IResponse, next: NextFunction): Promise<IResponse | void> => {
        try {
            if (hasId && !req.params.id) {
                return handleError(res, CommonErrorResponses.NOT_FOUND, "", createValidator, false);
            }
            const dataToValidate = { ...req.query, ...req.params, ...req.body };
            const { error, value } = validationScheme.validate(dataToValidate, {
                abortEarly: false,
                convert: true,
                stripUnknown: true,
            });
            if (error) {
                return res
                    .status(errorResponse.code)
                    .json(prepareErrorResponse(errorResponse, error?.message));
            }
            req.requestModel = value as T;
            return next();
        } catch (err) {
            return handleError(res, CommonErrorResponses.SERVER_ERROR, "", createValidator, true);
        }
    };
