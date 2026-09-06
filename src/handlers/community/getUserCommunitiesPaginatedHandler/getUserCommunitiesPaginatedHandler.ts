import { NextFunction } from "express";
import { IUser } from "../../../database/models/user/IUser.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { preparePagination } from "../../../helpers/pagination.js";
import { checkSecurity } from "../../../helpers/security.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { getUserCommunitiesPaginatedSecurity } from "./getUserCommunitiesPaginatedSecurity.js";

export const getUserCommunitiesPaginatedHandler = async (
    req: IRequest<APISignature, "communities">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const userId = req.requestModel?.id as string;
        const user = await UserQueries.getUserByIdQuery(userId);
        if (checkSecurity(getUserCommunitiesPaginatedSecurity(res, user as IUser))) {
            const { skip, limit } = preparePagination(req.query);
            const communities = await CommunityQueries.getCommunitiesOfUserPaginatedQuery(
                userId,
                skip,
                limit,
            );
            req.communities = communities;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getUserCommunitiesPaginatedHandler.name);
    }
};
