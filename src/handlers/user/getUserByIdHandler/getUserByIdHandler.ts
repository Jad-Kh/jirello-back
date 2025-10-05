import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { APISignature } from "../../../models/api/APISignature.js";
import { UserQueries } from "../../../database/queries/user.js";
import { checkSecurity } from "../../../helpers/security.js";
import { getUserByIdSecurity } from "./getUserByIdSecurity.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { IUser } from "../../../database/models/user/IUser.js";

export const getUserByIdHandler = async (req: IRequest<APISignature, "user">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const userId = req.requestModel?.id as string;
        const user = await UserQueries.getUserByIdQuery(userId);
        if (checkSecurity(getUserByIdSecurity(res, user as IUser))) {
            req.user = user;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getUserByIdHandler.name);
    }
};