import { RoleSuccessResponses } from "../responses/messages/success/role/roleSuccessResponses.js";
import { RolesOfCommunityResponseModel } from "../responses/models/role/RolesOfCommunityResponseModel.js";
import { RoleHierarchyResponseModel } from "../responses/models/role/RoleHierarchyResponseModel.js";
import { prepareSuccessResponse } from "./common/successResponsePresenter.js";

const createRolePresenter = async (req, res, next) => {
    req.statusCode = RoleSuccessResponses.CREATE_ROLE_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        RoleSuccessResponses.CREATE_ROLE_SUCCESS,
        null,
        { }
    );
    next();
};

const assignRoleToUserPresenter = async (req, res, next) => {
    req.statusCode = RoleSuccessResponses.ASSIGN_USER_TO_ROLE_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        RoleSuccessResponses.ASSIGN_USER_TO_ROLE_SUCCESS,
        null,
        { }
    );
    next();
};

const removeUserFromRolePresenter = async (req, res, next) => {
    req.statusCode = RoleSuccessResponses.REMOVE_USER_FROM_ROLE_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        RoleSuccessResponses.REMOVE_USER_FROM_ROLE_SUCCESS,
        null,
        { }
    );
    next();
};

const getCommunityRolesPresenter = async (req, res, next) => {
    const responseModel = new RolesOfCommunityResponseModel(req.community);
    req.statusCode = RoleSuccessResponses.ROLES_OF_COMMUNITY_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        RoleSuccessResponses.ROLES_OF_COMMUNITY_SUCCESS,
        null,
        responseModel
    );
    next();
};

const getCommunityRoleHierarchyPresenter = async (req, res, next) => {
    const responseModel = new RoleHierarchyResponseModel(req.community);
    req.statusCode = RoleSuccessResponses.ROLE_HIERARCHY_OF_COMMUNITY_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        RoleSuccessResponses.ROLE_HIERARCHY_OF_COMMUNITY_SUCCESS,
        null,
        responseModel
    );
    next();
};

export {
    createRolePresenter,
    assignRoleToUserPresenter,
    removeUserFromRolePresenter,
    getCommunityRolesPresenter,
    getCommunityRoleHierarchyPresenter
}