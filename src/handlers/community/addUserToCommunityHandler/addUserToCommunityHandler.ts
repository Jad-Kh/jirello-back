import { IRequest, IResponse } from "../../../helpers/api.js";
import { AddUserToCommunityRequest } from "./addUserToCommunityRequest.js";
import { NextFunction } from "express";
import { CommunityQueries } from "../../../database/queries/community.js";
import { UserQueries } from "../../../database/queries/user.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { checkSecurity } from "../../../helpers/security.js";
import { addUserToCommunitySecurity } from "./addUserToCommunitySecurity.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const addUserToCommunityHandler = async (req: IRequest<AddUserToCommunityRequest, "community">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel?.communityId as string) as ICommunity;
        const user = await UserQueries.getUserByIdQuery(requestModel?.userId as string) as IUser;
        if (checkSecurity(addUserToCommunitySecurity(res, community, user, requestModel))) {
            await CommunityQueries.addUserToCommunityQuery(requestModel?.communityId as string, requestModel?.userId as string);
            await UserQueries.addCommunityToUserQuery(requestModel?.userId as string, requestModel?.communityId as string);
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, addUserToCommunityHandler.name);
    }
};