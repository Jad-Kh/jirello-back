import bcrypt from "bcrypt";
import { NextFunction } from "express";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { setRefreshTokenCookie } from "../../../helpers/authCookies.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { JWTkit } from "../../../helpers/jwtkit.js";
import { UserResponse } from "../../../models/user/UserResponse.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { AuthErrorResponses } from "../../../responses/errors/AuthErrorResponses.js";
import { LogInRequest } from "./logInRequest.js";

export const logInHandler = async (
    req: IRequest<LogInRequest, "auth">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const request = req.requestModel!;
        const user = request.email
            ? await UserQueries.getUserByEmailQuery(request.email)
            : await UserQueries.getUserByUsernameQuery(request.username!);
        const passwordMatches = user ? await bcrypt.compare(request.password, user.profile.password) : false;

        if (!user || !passwordMatches) {
            res.status(401).json(prepareErrorResponse(AuthErrorResponses.LOGIN_VALIDATION_ERROR, null));
            return;
        }

        const refreshToken = JWTkit.generateRefreshToken(user);
        const accessToken = JWTkit.generateAccessToken(user);
        await UserQueries.updateUserAccessQuery(user.id, JWTkit.hashToken(refreshToken));
        setRefreshTokenCookie(res, refreshToken);

        req.auth = {
            accessToken,
            user: new UserResponse(user.toObject({ virtuals: true }) as unknown as UserResponse),
        };
        next();
    } catch (error) {
        catchError(error as Error, res, logInHandler.name);
    }
};
