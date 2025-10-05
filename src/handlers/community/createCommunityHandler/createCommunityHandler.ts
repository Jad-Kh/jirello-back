import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { catchError } from "../../../helpers/errorLogging.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { checkSecurity } from "../../../helpers/security.js";
import { createCommunitySecurity } from "./createCommunitySecurity.js";
import { createCommunityMapper } from "./createCommunityMapper.js";
import { CommunityRequest } from "./createCommunityRequest.js";
import { CommunityResponse } from "../../../models/community/CommunityResponse.js";
import { UserQueries } from "../../../database/queries/user.js";

export const createCommunityHandler = async (req: IRequest<CommunityRequest, "community">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const communityByName = await CommunityQueries.getCommunityByNameQuery(requestModel?.name as string) as ICommunity;
        const communityByFlag = await CommunityQueries.getCommunityByFlagQuery(requestModel?.flag as string) as ICommunity;
        if (checkSecurity(createCommunitySecurity(res, communityByName, communityByFlag))) {
            const mappedCommunity = await createCommunityMapper(requestModel as CommunityRequest, req.userId as string);
            const newCommunity = new CommunityResponse(mappedCommunity);
            const savedCommunity = await CommunityQueries.createCommunityQuery(newCommunity as ICommunity);
            await UserQueries.addCommunityToUserOwnedQuery(req.userId as string, savedCommunity._id.toString());
            req.community = savedCommunity;
            return next();
        }
    } catch(error) {
        catchError(error as Error, res, createCommunityHandler.name);
    }
};