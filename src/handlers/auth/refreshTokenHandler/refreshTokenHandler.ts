import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { catchError } from "../../../helpers/errorLogging.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { checkSecurity } from "../../../helpers/security.js";
import { refreshTokenSecurity } from "./refreshTokenSecurity.js";
import { JWTkit } from "../../../helpers/jwtkit.js";
import { APISignature } from "../../../models/api/APISignature.js";

export const refreshTokenHandler = async(req: IRequest<APISignature, "token">, res: IResponse, next: NextFunction) => {
    try {
        const userId = req.requestModel?.id as string;
        const access = await UserQueries.getUserAccessByIdQuery(userId) as IUser;
        if(checkSecurity(refreshTokenSecurity(res, access))) {
            req.token = JWTkit.generateJWTWithExpiration({id: userId});
            return next();
        }
    } catch(error) {
        catchError(error as Error, res, refreshTokenHandler.name);
    }
};