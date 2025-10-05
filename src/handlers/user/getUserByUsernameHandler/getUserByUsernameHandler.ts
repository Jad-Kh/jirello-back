import { IRequest, IResponse } from "../../../helpers/api.js";
import { GetUserByUsernameRequest } from "./getUserByUsernameRequest.js";
import { NextFunction } from "express";
import { UserQueries } from "../../../database/queries/user.js";
import { checkSecurity } from "../../../helpers/security.js";
import { getUserByUsernameSecurity } from "./getUserByUsernameSecurity.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { IUser } from "../../../database/models/user/IUser.js";

export const getUserByUsernameHandler = async (req: IRequest<GetUserByUsernameRequest, "user">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const username = req.requestModel?.username as string;
        const user = await UserQueries.getUserByUsernameQuery(username);
        if (checkSecurity(getUserByUsernameSecurity(res, user as IUser))) {
            req.user = user;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getUserByUsernameHandler.name);
    }
};