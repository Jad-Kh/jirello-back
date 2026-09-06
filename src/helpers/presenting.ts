import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../models/api/SuccessResponse.js";
import { prepareSuccessResponse } from "../presenters/common/successResponsePresenter.js";

type Constructor = new (data: never) => unknown;
type SuccessStatus = Pick<SuccessResponse<unknown>, "message" | "code">;

export const createPresenter =
    (
        successResponse: SuccessStatus,
        ResponseModelClass: Constructor | null = null,
        dataKey: string | null = null,
        setResponseStatus = false,
    ) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const requestState = req as unknown as Request & Record<string, unknown>;
        const rawData = dataKey ? requestState[dataKey] : (requestState.responseModel ?? {});
        const responseModel = ResponseModelClass ? new ResponseModelClass(rawData as never) : rawData;

        const resolvedSuccessResponse =
            (requestState.successResponse as SuccessStatus | undefined) ?? successResponse;
        requestState.statusCode = resolvedSuccessResponse.code;
        if (setResponseStatus) res.statusCode = resolvedSuccessResponse.code;
        requestState.presenterModel = prepareSuccessResponse(resolvedSuccessResponse, null, responseModel);
        next();
    };
