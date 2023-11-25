import { 
    getUsersOfCommunityQuery,
    getUsersOfCommunityPaginatedQuery, 
    getUserByIdQuery,
    getUserByUsernameQuery,
    getUserByEmailQuery,
    getUsersByRoleIdQuery,
    getUsersByRoleIdPaginatedQuery
} from "../database/queries/user/userQueries.js";
import { getCommunityByIdQuery } from "../database/queries/community/communityQueries.js";
import { getRoleByIdQuery } from "../database/queries/role/roleQueries.js";
import pkg from "lodash";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { UserErrorResponses } from "../responses/messages/errors/user/userErrorResponse.js";
import { CommunityErrorResponses } from "../responses/messages/errors/community/communityErrorResponse.js";
import { RoleErrorResponses } from "../responses/messages/errors/role/roleErrorResponse.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { preparePagination } from "../helpers/pagination.js";

const { isEmpty } = pkg;

const getUserByIdHandler = async (req, res, next) => {
    try {
        const userId = req.requestModel.id;
        const user = await getUserByIdQuery(userId);
        if (isEmpty(user)) {
            return res.status(UserErrorResponses.USER_NOT_FOUND.code)
              .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));
        }
        req.user = user;
        next();
    } catch(error) {
        prepareErrorLog(error, getUserByIdHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getUserByEmailHandler = async (req, res, next) => {
    try {
        const email = req.requestModel.email;
        const user = await getUserByEmailQuery(email);
        if (isEmpty(user)) {
            return res.status(UserErrorResponses.EMAIL_ERROR.code)
              .json(prepareErrorResponse(UserErrorResponses.EMAIL_ERROR, null));
        }
        req.user = user;
        next();
    } catch(error) {
        prepareErrorLog(error, getUserByEmailHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getUserByUsernameHandler = async (req, res, next) => {
    try {
        const username = req.requestModel.username;
        const user = await getUserByUsernameQuery(username);
        if (isEmpty(user)) {
            return res.status(UserErrorResponses.USERNAME_NOT_FOUND.code)
              .json(prepareErrorResponse(UserErrorResponses.USERNAME_NOT_FOUND, null));
        }
        req.user = user;
        next();
    } catch(error) {
        prepareErrorLog(error, getUserByUsernameHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getCommunityUsersHandler = async (req, res, next) => {
    try {
        const communityId = req.requestModel.id;
        const community = await getCommunityByIdQuery(communityId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        }
        const communityUsers = await getUsersOfCommunityQuery(communityId);
        const users = await Promise.all(
            communityUsers.map(user => {
                let role = "user";
                if (community.ownerIds.includes(user._id)) {
                    role = "owner";
                }
                return { user, role };
            }),
        );
        req.users = users;
        next();
    } catch(error) {
        prepareErrorLog(error, getCommunityUsersHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getCommunityUsersPaginatedHandler = async (req, res, next) => {
    try {
        const communityId = req.requestModel.id;
        const community = await getCommunityByIdQuery(communityId);
        if (isEmpty(community)) {
            return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
              .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
        }
        const { skip, limit } = preparePagination(req.query);
        const communityUsers = await getUsersOfCommunityPaginatedQuery(communityId, skip, limit);
        const users = await Promise.all(
            communityUsers.map(user => {
                let role = "user";
                if (community.ownerIds.includes(user._id)) {
                    role = "owner";
                }
                return { user, role };
            }),
        );
        req.users = users;
        next();
    } catch(error) {
        prepareErrorLog(error, getCommunityUsersPaginatedHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getRoleUsersHandler = async (req, res, next) => {
    try {
        const roleId = req.requestModel.id;
        const role = await getRoleByIdQuery(roleId);
        if (isEmpty(role)) {
            return res.status(RoleErrorResponses.ROLE_NOT_FOUND.code)
              .json(prepareErrorResponse(RoleErrorResponses.ROLE_NOT_FOUND, null));
        }
        const roleUsers = await getUsersByRoleIdQuery(roleId);
        const users = await Promise.all(
            roleUsers.map(user => { return user; }),
        );
        req.users = users;
        next();
    } catch(error) {
        prepareErrorLog(error, getRoleUsersHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getRoleUsersPaginatedHandler = async (req, res, next) => {
    try {
        const roleId = req.requestModel.id;
        const role = await getRoleByIdQuery(roleId);
        if (isEmpty(role)) {
            return res.status(RoleErrorResponses.ROLE_NOT_FOUND.code)
              .json(prepareErrorResponse(RoleErrorResponses.ROLE_NOT_FOUND, null));
        }
        const { skip, limit } = preparePagination(req.query);
        const roleUsers = await getUsersByRoleIdPaginatedQuery(roleId, skip, limit);
        const users = await Promise.all(
            roleUsers.map(user => { return user; }),
        );
        req.users = users;
        next();
    } catch(error) {
        prepareErrorLog(error, getRoleUsersPaginatedHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};


export {
    getCommunityUsersHandler,
    getCommunityUsersPaginatedHandler,
    getUserByIdHandler,
    getUserByEmailHandler,
    getUserByUsernameHandler,
    getRoleUsersHandler,
    getRoleUsersPaginatedHandler
}