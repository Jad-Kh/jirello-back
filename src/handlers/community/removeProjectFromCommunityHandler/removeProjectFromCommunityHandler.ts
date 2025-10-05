import { IRequest, IResponse } from "../../../helpers/api.js";
import { RemoveProjectFromCommunityRequest } from "./removeProjectFromCommunityRequest.js";
import { NextFunction } from "express";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ProjectQueries } from "../../../database/queries/project.js";
import { checkSecurity } from "../../../helpers/security.js";
import { removeProjectFromCommunitySecurity } from "./removeProjectFromCommunitySecurity.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const removeProjectFromCommunityHandler = async (req: IRequest<RemoveProjectFromCommunityRequest, "community">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel!;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel.communityId);
        const project = await ProjectQueries.getProjectByIdQuery(requestModel.projectId);
        if (checkSecurity(removeProjectFromCommunitySecurity(res, community, project))) {
            await CommunityQueries.removeProjectFromCommunityQuery(requestModel.communityId, requestModel.projectId);
            await ProjectQueries.updateProjectCommunityQuery(requestModel.projectId, requestModel.communityId);
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, removeProjectFromCommunityHandler.name);
    }
};