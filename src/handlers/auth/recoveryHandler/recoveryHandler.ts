import { IRequest, IResponse } from "../../../helpers/api.js";
import { RecoveryRequest } from "./recoveryRequest.js";
import { NextFunction } from "express";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { UserQueries } from "../../../database/queries/user.js";
import { recoverySecurity } from "./recoverySecurity.js";
import { IUser } from "../../../database/models/user/IUser.js";

export const recoveryHandler = async(req: IRequest<RecoveryRequest, "user">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const user = await UserQueries.getUserByEmailQuery(requestModel?.email as string) as IUser;
        if(checkSecurity(recoverySecurity(res, user))) {
            req.user = user;
            return next();
        }
    } catch(error) {
        catchError(error as Error, res, recoveryHandler.name);
    }
}