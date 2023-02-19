import { 
    createProjectQuery, 
    getProjectByNameQuery 
} from "../database/queries/project/projectQueries.js";
import { getCommunityByIdQuery } from "../database/queries/community/communityQueries.js";
import pkg from "lodash";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { ProjectErrorResponses } from "../responses/messages/errors/project/projectErrorResponses.js";
import { CommunityErrorResponses } from "../responses/messages/errors/community/communityErrorResponse.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { ProjectRequestModel } from "../requests/project/ProjectRequestModel.js";

const { isEmpty } = pkg;

const createProjectHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await getCommunityByIdQuery(requestModel.communityId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        } else {
            const userId = req.user.id;
            if(!community.ownerIds.includes(userId)) {
                return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                  .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));                
            } else {
                const projectCheck = await getProjectByNameQuery(requestModel.name);
                if (!isEmpty(projectCheck)) {
                    return res.status(ProjectErrorResponses.PROJECT_NAME_ALREADY_EXISTS.code)
                      .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_NAME_ALREADY_EXISTS, null));   
                } else {             
                    const organizerIds = [userId];
                    const userIds = [];
                    const taskIds = [];
                    const taskGroupIds = [];
                    const project = {
                        name: requestModel.name,
                        organizerIds,
                        userIds,
                        communityId: requestModel.communityId,
                        taskIds,
                        taskGroupIds
                    }
                    const newProject = new ProjectRequestModel(project);
                    const savedProject = await createProjectQuery(newProject);
                    req.project = savedProject;
                    next();
                }
            }
        }
    } catch(error) {
        prepareErrorLog(error, createProjectHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    createProjectHandler
}