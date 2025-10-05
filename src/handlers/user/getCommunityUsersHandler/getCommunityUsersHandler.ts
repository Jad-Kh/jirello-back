import { IRequest, IResponse } from "../../../helpers/api.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { NextFunction } from "express";
import { CommunityQueries } from "../../../database/queries/community.js";
import { checkSecurity } from "../../../helpers/security.js";
import { getCommunityUsersSecurity } from "./getCommunityUsersSecurity.js";
import { UserQueries } from "../../../database/queries/user.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const getCommunityUsersHandler = async (req: IRequest<APISignature, "users">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const communityId = req.requestModel?.id as string;
        const community = await CommunityQueries.getCommunityByIdQuery(communityId);
        if (checkSecurity(getCommunityUsersSecurity(res, community))) {
            const communityUsers = await UserQueries.getUsersOfCommunityQuery(communityId);
            const users = communityUsers.map(user => {
                const role = community.ownerIds.includes(user._id) ? "owner" : "user";
                return { user, role };
            });
            req.users = users;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, getCommunityUsersHandler.name);
    }
};