import { NextFunction } from "express";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { readRefreshToken, setRefreshTokenCookie } from "../../../helpers/authCookies.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { JWTkit } from "../../../helpers/jwtkit.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../../../responses/errors/CommonErrorResponses.js";

export const refreshTokenHandler = async (
    req: IRequest<Record<string, never>, "token">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const currentToken = readRefreshToken(req);
        if (!currentToken) {
            res.status(401).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
            return;
        }

        const payload = JWTkit.verifyRefreshToken(currentToken);
        const user = await UserQueries.getUserAccessByIdQuery(payload.sub);
        const storedHash = user?.access?.refreshToken;
        if (!storedHash || !JWTkit.tokenMatchesHash(currentToken, storedHash)) {
            res.status(401).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
            return;
        }

        const rotatedRefreshToken = JWTkit.generateRefreshToken(payload.sub);
        await UserQueries.updateUserAccessQuery(payload.sub, JWTkit.hashToken(rotatedRefreshToken));
        setRefreshTokenCookie(res, rotatedRefreshToken);
        req.token = { token: JWTkit.generateAccessToken(payload.sub) };
        next();
    } catch (error) {
        if (
            error instanceof Error &&
            (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError")
        ) {
            res.status(401).json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
            return;
        }
        catchError(error as Error, res, refreshTokenHandler.name);
    }
};
