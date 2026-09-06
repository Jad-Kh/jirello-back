import { NextFunction } from "express";
import { IUser } from "../../../database/models/user/IUser.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { getUserCommunitiesSecurity } from "./getUserCommunitiesSecurity.js";

export const getUserCommunitiesHandler = async (
    req: IRequest<APISignature, "communities">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.requestModel?.id as string;
        const user = await UserQueries.getUserByIdQuery(userId);
        if (checkSecurity(getUserCommunitiesSecurity(res, user as IUser))) {
            const communities = await CommunityQueries.getCommunitiesOfUserQuery(userId);
            req.communities = communities;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getUserCommunitiesHandler.name);
    }
};
