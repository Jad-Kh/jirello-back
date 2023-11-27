import {
    addUserToRoleQuery,
    getRoleByIdQuery,
    removeUserFromRoleQuery
} from "../database/queries/role/roleQueries.js";
import { assignRoleToUserQuery } from "../database/queries/user/userQueries.js";
import { RoleErrorResponses } from "../responses/messages/errors/role/roleErrorResponse.js";
import { UserErrorResponses } from "../responses/messages/errors/user/userErrorResponse.js";
import pkg from "lodash";

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

export {
    assignRoleToUserHandler,
    removeUserFromRoleHandler
}