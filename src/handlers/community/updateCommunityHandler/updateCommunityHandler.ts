import { IRequest, IResponse } from "../../../helpers/api.js";
import { UpdateCommunityRequest } from "./updateCommunityRequest.js";
import { NextFunction } from "express";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { updateCommunitySecurity } from "./updateCommunitySecurity.js";
import { checkSecurity } from "../../../helpers/security.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const updateCommunityHandler = async (req: IRequest<UpdateCommunityRequest, "community">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel?.id as string) as ICommunity;
        if (checkSecurity(updateCommunitySecurity(res, community, req.userId as string))) {
            const { id, ...updateModel } = requestModel as UpdateCommunityRequest;
            const updatedCommunity = await CommunityQueries.updateCommunityQuery(id, updateModel);
            req.community = updatedCommunity;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, updateCommunityHandler.name);
    }
};