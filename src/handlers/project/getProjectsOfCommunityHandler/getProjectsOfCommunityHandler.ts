import { NextFunction } from "express";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ProjectQueries } from "../../../database/queries/project.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { preparePagination } from "../../../helpers/pagination.js";
import { APISignature } from "../../../models/api/APISignature.js";
import { getProjectsOfCommunitySecurity } from "./getProjectsOfCommunitySecurity.js";

export const getProjectsOfCommunityHandler = async (
    req: IRequest<APISignature, "projects">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const communityId = requestModel?.id as string;
        const community = (await CommunityQueries.getCommunityByIdQuery(communityId)) as ICommunity;
        if (checkSecurity(getProjectsOfCommunitySecurity(res, community))) {
            const { skip, limit } = preparePagination(req.query);
            const search =
                typeof req.query.search === "string" ? req.query.search.trim().slice(0, 120) : undefined;
            const projects = await ProjectQueries.getProjectsOfCommunityPaginatedQuery(
                communityId,
                skip,
                limit,
                search,
            );
            req.projects = projects;
            next();
        }
    } catch (error) {
        catchError(error as Error, res, getProjectsOfCommunityHandler.name);
    }
};
