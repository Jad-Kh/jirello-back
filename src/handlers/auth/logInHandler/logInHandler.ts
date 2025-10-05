import { IRequest, IResponse } from "../../../helpers/api.js";
import { LogInRequest } from "./logInRequest.js";
import { NextFunction } from "express";
import { UserQueries } from "../../../database/queries/user.js";
import { checkSecurity } from "../../../helpers/security.js";
import { logInSecurity } from "./logInSecurity.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { JWTkit } from "../../../helpers/jwtkit.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const logInHandler = async(req: IRequest<LogInRequest, "user">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const userByUsername = (requestModel?.username && await UserQueries.getUserByUsernameQuery(requestModel?.username)) as IUser;
        const userByEmail = (requestModel?.email && await UserQueries.getUserByEmailQuery(requestModel?.email)) as IUser;
        const user = userByUsername || userByEmail;
        if(checkSecurity(await logInSecurity(res, user, requestModel.password, requestModel.username))) {
            const refreshToken = JWTkit.generateJWT(user);
            await UserQueries.updateUserAccessQuery(user.id as string, refreshToken);
            const accessToken = JWTkit.generateJWTWithExpiration(user);
            req.user = { user, refreshToken, accessToken };
            return next();
        }
    } catch(error) {
        catchError(error as Error, res, logInHandler.name);
    }
};