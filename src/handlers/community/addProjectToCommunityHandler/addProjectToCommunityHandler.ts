import { AddProjectToCommunityRequest } from "./addProjectToCommunityRequest.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { NextFunction } from "express";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ProjectQueries } from "../../../database/queries/project.js";
import { addProjectToCommunitySecurity } from "./addProjectToCommunitySecurity.js";
import { checkSecurity } from "../../../helpers/security.js";
import { catchError } from "../../../helpers/errorLogging.js";

export const addProjectToCommunityHandler = async (req: IRequest<AddProjectToCommunityRequest, "community">, res: IResponse, next: NextFunction
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel?.communityId as string);
        const project = await ProjectQueries.getProjectByIdQuery(requestModel?.projectId as string);
        if (checkSecurity(addProjectToCommunitySecurity(res, community, project))) {
            await CommunityQueries.addProjectToCommunityQuery(requestModel?.communityId as string, requestModel?.projectId as string);
            await ProjectQueries.updateProjectCommunityQuery(requestModel?.projectId as string, requestModel?.communityId as string);
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, addProjectToCommunityHandler.name);
    }
};
