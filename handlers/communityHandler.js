import { 
    createCommunityQuery, 
    getCommunityByNameQuery, 
    getCommunityByFlagQuery 
} from "../database/queries/community/communityQueries.js";
import { CommunityRequestModel } from "../requests/community/CommunityRequestModel.js";
import { CommunityErrorResponses } from "../responses/messages/errors/community/communityErrorResponse.js";
import pkg from "lodash";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";

const { isEmpty } = pkg;
    
const createCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const communityByName = await getCommunityByNameQuery(requestModel.name);
        const communityByFlag = await getCommunityByFlagQuery(requestModel.flag);
        if(!isEmpty(communityByName)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NAME_ALREADY_EXISTS.code)
                .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NAME_ALREADY_EXISTS, null));            
        } else if(!isEmpty(communityByFlag)) {
            return res.status(CommunityErrorResponses.COMMUNITY_FLAG_ALREADY_EXISTS.code)
                .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_FLAG_ALREADY_EXISTS, null));
        } else {
            const ownerIds = [req.user.id];
            const userIds = [];
            const projectIds = [];
            const template = "Normal";
            const permissions = {
                canUserViewOtherTasks: requestModel.canUserViewOtherTasks,
                canUserViewOtherTaskGroups: requestModel.canUserViewOtherTaskGroups,
                canUserCreateTasks: requestModel.canUserCreateTasks,
                canUserCreateTaskGroups: requestModel.canUserCreateTaskGroups,
                canUserEditTasks: requestModel.canUserEditTasks,
                canUserSetTaskToComplete: requestModel.canUserSetTaskToComplete,
                canUserSetTaskToIncomplete: requestModel.canUserSetTaskToIncomplete,
                canUserEditTaskGroups: requestModel.canUserEditTaskGroups,
                canUserViewOtherProjects: requestModel.canUserViewOtherProjects, 
            }
            const community = {
                name: requestModel.name,
                flag: requestModel.flag,
                ownerIds,
                userIds,
                projectIds,
                template,
                permissions
            }
            const newCommunity = new CommunityRequestModel(community);
            const savedCommunity = await createCommunityQuery(newCommunity);
            req.community = savedCommunity;
            next();
        }
    } catch(error) {
        prepareErrorLog(error, createCommunityHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    createCommunityHandler
}