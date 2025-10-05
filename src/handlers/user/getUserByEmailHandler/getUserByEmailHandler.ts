import { IRequest, IResponse } from "../../../helpers/api.js";
import { GetUserByEmailRequest } from "./getUserByEmailRequest.js";
import { NextFunction } from "express";
import { UserQueries } from "../../../database/queries/user.js";
import { getUserByEmailSecurity } from "./getUserByEmailSecurity.js";
import { checkSecurity } from "../../../helpers/security.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { IUser } from "../../../database/models/user/IUser.js";

export const getUserByEmailHandler = async (req: IRequest<GetUserByEmailRequest, "user">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const email = req.requestModel?.email as string;
        const user = await UserQueries.getUserByEmailQuery(email);
        if (checkSecurity(getUserByEmailSecurity(res, user as IUser))) {
            req.user = user;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getUserByEmailHandler.name);
    }
};