import { 
    createCommunityQuery, 
    getCommunityByIdQuery,
    getCommunityByNameQuery, 
    getCommunityByFlagQuery, 
    updateCommunityQuery,
    addUserToCommunityQuery,
    removeUserFromCommunityQuery,
    addProjectToCommunityQuery
} from "../database/queries/community/communityQueries.js";
import { getProjectByIdQuery, updateProjectCommunityQuery } from "../database/queries/project/projectQueries.js";
import { addCommunityToUserOwnedQuery, addCommunityToUserQuery, getUserByIdQuery, removeCommunityFromUserQuery } from "../database/queries/user/userQueries.js";
import { CommunityRequestModel } from "../requests/community/CommunityRequestModel.js";
import { CommunityErrorResponses } from "../responses/messages/errors/community/communityErrorResponse.js";
import { UserErrorResponses } from "../responses/messages/errors/user/userErrorResponse.js";
import pkg from "lodash";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { ProjectErrorResponses } from "../responses/messages/errors/project/projectErrorResponses.js";

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
            const roleIds = [];
            const screenIds = [];
            const validationLevel = 0;
            const requiredValidationLevel = 0;
            const permissions = {
                tasks : requestModel.tasks,
                taskGroups : requestModel.taskGroups,
                meetings : requestModel.meetings,
                projects : requestModel.projects,
                screens : requestModel.screens,
                roles : requestModel.roles
            }
            const community = {
                name: requestModel.name,
                flag: requestModel.flag,
                ownerIds,
                userIds,
                projectIds,
                template, 
                roleIds,
                screenIds,
                validationLevel,
                requiredValidationLevel,
                permissions
            }
            const newCommunity = new CommunityRequestModel(community);
            const savedCommunity = await createCommunityQuery(newCommunity);
            await addCommunityToUserOwnedQuery(req.user.id, savedCommunity._id);
            req.community = savedCommunity;
            next();
        }
    } catch(error) {
        prepareErrorLog(error, createCommunityHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const updateCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await getCommunityByIdQuery(requestModel.id);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        } else {
            const userId = req.user.id;
            if(!community.ownerIds.includes(userId)) {
                return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                  .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));                
            } else {
                const { id, ...updateModel } = requestModel;
                const updatedCommunity = await updateCommunityQuery(id, updateModel);
                req.community = updatedCommunity;
                next();
            }
        }
    } catch(error) {
        prepareErrorLog(error, updateCommunityHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));        
    }
};

const addUserToCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await getCommunityByIdQuery(requestModel.communityId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        } else {
            const user = await getUserByIdQuery(requestModel.userId);
            if (isEmpty(user)) {
                return res.status(UserErrorResponses.USER_NOT_FOUND.code)
                  .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));   
            } else {
                if(community.userIds.includes(requestModel.userId) || community.ownerIds.includes(requestModel.ownerId)) {
                    return res.status(CommunityErrorResponses.COMMUNITY_USER_FOUND.code)
                      .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_USER_FOUND, null));                    
                } else {
                    await addUserToCommunityQuery(requestModel.communityId, requestModel.userId);
                    await addCommunityToUserQuery(requestModel.userId, requestModel.communityId);
                    next();
                }
            }
        }
    } catch(error) {
        prepareErrorLog(error, addUserToCommunityHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));         
    }
};

const removeUserFromCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await getCommunityByIdQuery(requestModel.communityId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        } else {
            const user = await getUserByIdQuery(requestModel.userId);
            if (isEmpty(user)) {
                return res.status(UserErrorResponses.USER_NOT_FOUND.code)
                  .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));   
            } else {
                if(!community.userIds.includes(requestModel.userId) || !community.ownerIds.includes(requestModel.ownerId)) {
                    return res.status(CommunityErrorResponses.COMMUNITY_USER_NOT_FOUND.code)
                      .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_USER_NOT_FOUND, null));                    
                } else {
                    await removeUserFromCommunityQuery(requestModel.communityId, requestModel.userId);
                    await removeCommunityFromUserQuery(requestModel.userId, requestModel.communityId);
                    next();
                }
            }
        }
    } catch(error) {
        prepareErrorLog(error, removeUserFromCommunityHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));         
    }
};

const addProjectToCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await getCommunityByIdQuery(requestModel.communityId);
        const project = await getProjectByIdQuery(requestModel.projectId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        } else if(isEmpty(project)) {
            return res.status(ProjectErrorResponses.PROJECT_NOT_FOUND.code)
              .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_NOT_FOUND, null));            
        } else {
            await addProjectToCommunityQuery(requestModel.communityId, requestModel.projectId);
            await updateProjectCommunityQuery(requestModel.projectId, requestModel.communityId);
            next();            
        }
    } catch(error) {
        prepareErrorLog(error, addProjectToCommunityHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));         
    }
};

export {
    createCommunityHandler,
    updateCommunityHandler,
    addUserToCommunityHandler,
    removeUserFromCommunityHandler,
    addProjectToCommunityHandler
}