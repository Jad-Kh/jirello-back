import { NextFunction } from "express";
import { IUser } from "../../../database/models/user/IUser.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { authorizeCommunityMember } from "../../../security/resourceSecurity.js";
import { GetUserByUsernameRequest } from "./getUserByUsernameRequest.js";
import { getUserByUsernameSecurity } from "./getUserByUsernameSecurity.js";

export const getUserByUsernameHandler = async (
    req: IRequest<GetUserByUsernameRequest, "user">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const username = req.requestModel?.username as string;
        const user = await UserQueries.getUserByUsernameQuery(username);
        if (user && !authorizeCommunityMember(res, req.community, user.id)) return;
        if (checkSecurity(getUserByUsernameSecurity(res, user as IUser))) {
            req.user = user;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getUserByUsernameHandler.name);
    }
};
