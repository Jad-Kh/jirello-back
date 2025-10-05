import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { RemoveUserFromCommunityRequest } from "./removeUserFromCommunityRequest.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { UserQueries } from "../../../database/queries/user.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { removeUserFromCommunitySecurity } from "./removeUserFromCommunitySecurity.js";
import { checkSecurity } from "../../../helpers/security.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const removeUserFromCommunityHandler = async (req: IRequest<RemoveUserFromCommunityRequest, "community">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel?.communityId as string) as ICommunity;
        const user = await UserQueries.getUserByIdQuery(requestModel?.userId as string) as IUser;

        if (checkSecurity(removeUserFromCommunitySecurity(res, community, user, requestModel))) {
            await CommunityQueries.removeUserFromCommunityQuery(requestModel?.communityId as string, requestModel?.userId as string);
            await UserQueries.removeCommunityFromUserQuery(requestModel?.userId as string, requestModel?.communityId as string);
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, removeUserFromCommunityHandler.name);
    }
};