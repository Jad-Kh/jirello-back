import { UsersOfCommunityResponseModel } from "../responses/models/user/UsersOfCommunityResponseModel.js";
import { UserSuccessResponses } from "../responses/messages/success/user/userSuccessResponses.js";
import { UserResponseModel } from "../responses/models/user/UserResponseModel.js";
import { UsersOfRoleResponseModel } from "../responses/models/user/UsersOfRoleResponseModel.js";
import { prepareSuccessResponse } from "./common/successResponsePresenter.js";

const getUserPresenter = async (req, res, next) => {
    const responseModel = new UserResponseModel(req.users);
    req.statusCode = UserSuccessResponses.GET_USER_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        UserSuccessResponses.GET_USER_SUCCESS,
        null,
        responseModel
    );
    next();
};

const getCommunityUsersPresenter = async (req, res, next) => {
    const responseModel = new UsersOfCommunityResponseModel(req.users);
    req.statusCode = UserSuccessResponses.USERS_OF_COMMUNITY_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        UserSuccessResponses.USERS_OF_COMMUNITY_SUCCESS,
        null,
        responseModel
    );
    next();
};

const getRoleUsersPresenter = async (req, res, next) => {
    const responseModel = new UsersOfRoleResponseModel(req.users);
    req.statusCode = UserSuccessResponses.USERS_OF_ROLE_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        UserSuccessResponses.USERS_OF_ROLE_SUCCESS,
        null,
        responseModel
    );
    next();
};

export {
    getUserPresenter,
    getCommunityUsersPresenter,
    getRoleUsersPresenter
}