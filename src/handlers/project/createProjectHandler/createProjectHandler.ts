import { IRequest, IResponse } from "../../../helpers/api.js";
import { CreateProjectRequest } from "./createProjectRequest.js";
import { NextFunction } from "express";
import { checkSecurity } from "../../../helpers/security.js";
import { createProjectSecurity } from "./createProjectSecurity.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ProjectQueries } from "../../../database/queries/project.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { IProject } from "../../../database/models/project/IProject.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { createProjectMapper } from "./createProjectMapper.js";

export const createProjectHandler = async (req: IRequest<CreateProjectRequest, "project">, res: IResponse, next: NextFunction): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel?.communityId as string) as ICommunity;
        const existingProject = await ProjectQueries.getProjectByNameQuery(requestModel?.name as string) as IProject;
        const userId = req.userId as string;
        if (checkSecurity(createProjectSecurity(res, community, userId, existingProject))) {
            const project = await createProjectMapper(requestModel as CreateProjectRequest, requestModel!.communityId);
            const savedProject = await ProjectQueries.createProjectQuery(project);
            await CommunityQueries.addProjectToCommunityQuery(requestModel!.communityId, savedProject._id.toString());
            req.project = savedProject;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, createProjectHandler.name);
    }
};