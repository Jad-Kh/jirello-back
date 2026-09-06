import { NextFunction } from "express";
import { IUser } from "../../../database/models/user/IUser.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { authorizeCommunityMember } from "../../../security/resourceSecurity.js";
import { GetUserByEmailRequest } from "./getUserByEmailRequest.js";
import { getUserByEmailSecurity } from "./getUserByEmailSecurity.js";

export const getUserByEmailHandler = async (
    req: IRequest<GetUserByEmailRequest, "user">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const email = req.requestModel?.email as string;
        const user = await UserQueries.getUserByEmailQuery(email);
        if (user && !authorizeCommunityMember(res, req.community, user.id)) return;
        if (checkSecurity(getUserByEmailSecurity(res, user as IUser))) {
            req.user = user;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getUserByEmailHandler.name);
    }
};
