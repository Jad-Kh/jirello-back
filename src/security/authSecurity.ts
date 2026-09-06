import { NextFunction } from "express";
import { IRequest, IResponse } from "../helpers/api.js";
import { parseUsernameOrEmail } from "../helpers/logIn.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { AuthErrorResponses } from "../responses/errors/AuthErrorResponses.js";

export const parseUsernameOrEmailSecurity = (
    req: IRequest<unknown, never>,
    res: IResponse,
    next: NextFunction,
): void => {
    const usernameOrEmail = req.body?.usernameOrEmail;
    if (typeof usernameOrEmail !== "string") {
        res.status(400).json(
            prepareErrorResponse(AuthErrorResponses.LOGIN_VALIDATION_ERROR, "usernameOrEmail is required."),
        );
        return;
    }

    req.body = parseUsernameOrEmail(req.body);
    next();
};
