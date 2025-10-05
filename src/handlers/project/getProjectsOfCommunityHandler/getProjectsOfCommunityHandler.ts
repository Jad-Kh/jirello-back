import { IRequest, IResponse } from "../../../helpers/api.ts";
import { NextFunction } from "express";
import { APISignature } from "../../../models/api/APISignature.ts";
import { CommunityQueries } from "../../../database/queries/community.ts";
import { ICommunity } from "../../../database/models/community/ICommunity.ts";
import { ProjectQueries } from "../../../database/queries/project.ts";
import { checkSecurity } from "../../../helpers/security.ts";
import { getProjectsOfCommunitySecurity } from "./getProjectsOfCommunitySecurity.ts";
import { catchError } from "../../../helpers/errorLogging.ts";

export const getProjectsOfCommunityHandler = async (req: IRequest<APISignature, "projects">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const communityId = requestModel?.id as string;
        const community = await CommunityQueries.getCommunityByIdQuery(communityId) as ICommunity;
        if (checkSecurity(getProjectsOfCommunitySecurity(res, community))) {
            const projects = await ProjectQueries.getProjectsOfCommunityQuery(communityId);
            req.projects = projects;
            next();
        }
    } catch (error) {
        catchError(error as Error, res, getProjectsOfCommunityHandler.name);
    }
};