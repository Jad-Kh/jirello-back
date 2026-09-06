import { NextFunction } from "express";
import { IRequest, IResponse } from "../helpers/api.js";
import { JWTkit } from "../helpers/jwtkit.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.js";

export const tokenSecurity = (req: IRequest<unknown, never>, res: IResponse, next: NextFunction): void => {
    const authorization = req.header("authorization");
    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme?.toLowerCase() !== "bearer" || !token) {
        res.status(401).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
        return;
    }

    try {
        const payload = JWTkit.verifyAccessToken(token);
        req.userId = payload.sub;
        next();
    } catch {
        res.status(401).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
    }
};
