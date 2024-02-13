import { getCommunityByIdQuery } from "../database/queries/community/communityQueries.js";
import {
    addUserToRoleQuery,
    getRoleByIdQuery,
    getRolesOfCommunityPaginatedQuery,
    getRolesOfCommunityQuery,
    removeUserFromRoleQuery
} from "../database/queries/role/roleQueries.js";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { preparePagination } from "../helpers/pagination.js";
import {
    assignRoleToUserQuery,
    getUserByIdQuery,
    removeRoleFromUserQuery
} from "../database/queries/user/userQueries.js";
import { RoleErrorResponses } from "../responses/messages/errors/role/roleErrorResponse.js";
import { UserErrorResponses } from "../responses/messages/errors/user/userErrorResponse.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { CommunityErrorResponses } from "../responses/messages/errors/community/communityErrorResponse.js";
import pkg from "lodash";
import {prepareNesting} from "../helpers/nesting.js";

const { isEmpty } = pkg;

const assignRoleToUserHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const role = await getRoleByIdQuery(requestModel.roleId);
        if (isEmpty(role)) {
            return res.status(RoleErrorResponses.ROLE_NOT_FOUND.code)
              .json(prepareErrorResponse(RoleErrorResponses.ROLE_NOT_FOUND, null));
        } else {
            const user = await getUserByIdQuery(requestModel.userId);
            if (isEmpty(user)) {
                return res.status(UserErrorResponses.USER_NOT_FOUND.code)
                  .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));   
            } else {
                if(role.userIds.includes(requestModel.userId)) {
                    return res.status(RoleErrorResponses.ROLE_USER_FOUND.code)
                      .json(prepareErrorResponse(RoleErrorResponses.ROLE_USER_FOUND, null));                    
                } else {
                    await addUserToRoleQuery(requestModel.roleId, requestModel.userId);
                    await assignRoleToUserQuery(requestModel.userId, requestModel.roleId);
                    next();
                }
            }
        }
    } catch(error) {
        prepareErrorLog(error, assignRoleToUserHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));         
    }
};

const removeUserFromRoleHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const role = await getRoleByIdQuery(requestModel.roleId);
        if (isEmpty(role)) {
            return res.status(RoleErrorResponses.ROLE_NOT_FOUND.code)
              .json(prepareErrorResponse(RoleErrorResponses.ROLE_NOT_FOUND, null));
        } else {
            const user = await getUserByIdQuery(requestModel.userId);
            if (isEmpty(user)) {
                return res.status(UserErrorResponses.USER_NOT_FOUND.code)
                  .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));   
            } else {
                if(!role.userIds.includes(requestModel.userId)) {
                    return res.status(RoleErrorResponses.ROLE_USER_NOT_FOUND.code)
                      .json(prepareErrorResponse(RoleErrorResponses.ROLE_USER_NOT_FOUND, null));                      
                } else {
                    await removeUserFromRoleQuery(requestModel.roleId, requestModel.userId);
                    await removeRoleFromUserQuery(requestModel.userId, requestModel.roleId);
                    next();
                }
            }
        }
    } catch(error) {
        prepareErrorLog(error, removeUserFromRoleHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getCommunityRolesHandler = async(req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await getCommunityByIdQuery(requestModel.communityId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        } else {
            const roles = await getRolesOfCommunityQuery(requestModel.communityId);
            req.roles = roles;
            next();
        }
    } catch(error) {
        prepareErrorLog(error, getCommunityRolesHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getCommunityRolesPaginatedHandler = async(req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await getCommunityByIdQuery(requestModel.communityId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        } else {
            const { skip, limit } = preparePagination(req.query);
            const roles = await getRolesOfCommunityPaginatedQuery(requestModel.communityId, skip, limit);
            req.roles = roles;
            next();
        }
    } catch(error) {
        prepareErrorLog(error, getCommunityRolesPaginatedHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getCommunityRoleHierarchyHandler = async(req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await getCommunityByIdQuery(requestModel.communityId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
                .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        } else {
            const roles = await getRolesOfCommunityQuery(requestModel.communityId);
            const nestedRoles = await prepareNesting(roles);
            req.roles = nestedRoles;
            next();
        }
    } catch(error) {
        prepareErrorLog(error, getCommunityRoleHierarchyHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    assignRoleToUserHandler,
    removeUserFromRoleHandler,
    getCommunityRolesHandler,
    getCommunityRolesPaginatedHandler,
    getCommunityRoleHierarchyHandler
}