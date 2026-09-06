import { NextFunction } from "express";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { setRefreshTokenCookie } from "../../../helpers/authCookies.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { JWTkit } from "../../../helpers/jwtkit.js";
import { UserResponse } from "../../../models/user/UserResponse.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { AuthErrorResponses } from "../../../responses/errors/AuthErrorResponses.js";
import { signUpMapper } from "./signUpMapper.js";
import { SignUpRequest } from "./signUpRequest.js";

export const signUpHandler = async (
    req: IRequest<SignUpRequest, "auth">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const request = req.requestModel!;
        const [userByEmail, userByUsername] = await Promise.all([
            UserQueries.getUserByEmailQuery(request.email),
            UserQueries.getUserByUsernameQuery(request.username),
        ]);

        if (userByEmail) {
            res.status(AuthErrorResponses.EMAIL_EXISTS_ERROR.code).json(
                prepareErrorResponse(AuthErrorResponses.EMAIL_EXISTS_ERROR, null),
            );
            return;
        }
        if (userByUsername) {
            res.status(AuthErrorResponses.USERNAME_EXISTS_ERROR.code).json(
                prepareErrorResponse(AuthErrorResponses.USERNAME_EXISTS_ERROR, null),
            );
            return;
        }

        const savedUser = await UserQueries.createUserQuery(await signUpMapper(request));
        const refreshToken = JWTkit.generateRefreshToken(savedUser);
        const accessToken = JWTkit.generateAccessToken(savedUser);
        await UserQueries.updateUserAccessQuery(savedUser.id, JWTkit.hashToken(refreshToken));
        setRefreshTokenCookie(res, refreshToken);

        req.auth = {
            accessToken,
            user: new UserResponse(savedUser.toObject({ virtuals: true }) as unknown as UserResponse),
        };
        next();
    } catch (error) {
        catchError(error as Error, res, signUpHandler.name);
    }
};
