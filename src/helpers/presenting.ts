import { prepareSuccessResponse } from "../presenters/common/successResponsePresenter.js";
import { SuccessResponse } from "../models/api/SuccessResponse.js";
import { Request, Response } from "express";
import { NextFunction } from "express";

type Constructor<T> = new (data: any) => T;

export const createPresenter = <T>(
    successResponse: SuccessResponse<T>,
    ResponseModelClass: Constructor<T> | null = null,
    dataKey: string | null = null,
    setResStatus: boolean = false
) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const reqAsAny = req as any;
        const rawData = dataKey ? reqAsAny[dataKey] : reqAsAny.responseModel || {};
        const responseModel: T | any = ResponseModelClass
            ? new ResponseModelClass(rawData)
            : rawData;

        const code = successResponse.code;
        if (setResStatus) {
            res.statusCode = code;
        } else {
            reqAsAny.statusCode = code;
        }

        reqAsAny.presenterModel = prepareSuccessResponse(successResponse, null, responseModel);
        return next();
    };
};
