import { NextFunction } from "express";
import { IUser } from "../../../database/models/user/IUser.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { authorizeCommunityMember } from "../../../security/resourceSecurity.js";
import { getUserByIdSecurity } from "./getUserByIdSecurity.js";

export const getUserByIdHandler = async (
    req: IRequest<APISignature, "user">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.requestModel?.id as string;
        const user = await UserQueries.getUserByIdQuery(userId);
        if (user && !authorizeCommunityMember(res, req.community, user.id)) return;
        if (checkSecurity(getUserByIdSecurity(res, user as IUser))) {
            req.user = user;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getUserByIdHandler.name);
    }
};
