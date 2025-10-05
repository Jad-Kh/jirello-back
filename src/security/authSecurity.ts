import { JWTkit } from "../helpers/jwtkit.ts";
import { parseUsernameOrEmail } from "../helpers/logIn.ts";
import { IRequest, IResponse } from "../helpers/api.ts";
import { NextFunction } from "express";
import { handleError } from "../helpers/errorLogging.ts";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.ts";
import { RefreshTokenResponse } from "../models/auth/RefreshTokenResponse.ts";

export const authSecurity = async (req: IRequest<RefreshTokenResponse, "user">, res: IResponse, next: NextFunction) => {
    try {
        const user = req.user;
        const registeredToken = JWTkit.generateJWTWithExpiration(user);
        res.cookie("token", registeredToken);
        req.userId = user._id;
        req.requestModel!.token = registeredToken;
        return next();
    } catch (error) {
        return handleError(
            res,
            CommonErrorResponses.SERVER_ERROR,
            error as string,
            authSecurity,
            true
        );
    }
};

export const parseUsernameOrEmailSecurity = async (req: IRequest<any, "user">, res: IResponse, next: NextFunction) => {
    try {
        const data = parseUsernameOrEmail(req.body)
        req.body = data;
        return next();
    } catch (error) {
        return handleError(
            res,
            CommonErrorResponses.SERVER_ERROR,
            error as string,
            parseUsernameOrEmailSecurity,
            true
        );
    }
};