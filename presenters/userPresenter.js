import { UsersOfCommunityResponseModel } from "../responses/models/user/UsersOfCommunityResponseModel.js";
import { UserSuccessResponses } from "../responses/messages/success/user/userSuccessResponses.js";
import { prepareSuccessResponse } from "./common/successResponsePresenter.js";

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

export {
    getCommunityUsersPresenter
}