import { NextFunction } from "express";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { preparePagination } from "../../../helpers/pagination.js";
import { checkSecurity } from "../../../helpers/security.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { getCommunityUsersPaginatedMapper } from "./getCommunityUsersPaginatedMapper.js";
import { getCommunityUsersPaginatedSecurity } from "./getCommunityUsersPaginatedSecurity.js";

export const getCommunityUsersPaginatedHandler = async (
    req: IRequest<APISignature, "users">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const communityId = req.requestModel?.id as string;
        const community = (await CommunityQueries.getCommunityByIdQuery(communityId)) as ICommunity;
        if (checkSecurity(getCommunityUsersPaginatedSecurity(res, community))) {
            const { skip, limit } = preparePagination(req.query);
            const communityUsers = await UserQueries.getUsersOfCommunityPaginatedQuery(
                communityId,
                skip,
                limit,
            );
            const users = await getCommunityUsersPaginatedMapper(community, communityUsers);
            req.users = users;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getCommunityUsersPaginatedHandler.name);
    }
};
