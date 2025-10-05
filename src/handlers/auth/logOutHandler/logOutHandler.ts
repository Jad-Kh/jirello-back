import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { catchError } from "../../../helpers/errorLogging.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { checkSecurity } from "../../../helpers/security.js";
import { logOutSecurity } from "./logOutSecurity.js";

export const logOutHandler = async(req: IRequest<APISignature, "user">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const userId = req.requestModel?.id as string;
        const user = await UserQueries.getUserByIdQuery(userId) as IUser;
        if(checkSecurity(logOutSecurity(res, user))) {
            await UserQueries.removeUserAccessQuery(userId);
            return next();
        }
    } catch(error) {
        catchError(error as Error, res, logOutHandler.name);
    }
};