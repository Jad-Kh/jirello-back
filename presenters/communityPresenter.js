import { CommunityResponseModel } from "../responses/models/community/CommunityResponseModel.js";
import { CommunitySuccessResponses } from "../responses/messages/success/community/communitySuccessResponses.js";
import { prepareSuccessResponse } from "./common/successResponsePresenter.js";

const createCommunityPresenter = async (req, res, next) => {
    const responseModel = new CommunityResponseModel(req.community);
    req.statusCode = CommunitySuccessResponses.CREATE_COMMUNITY_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        CommunitySuccessResponses.CREATE_COMMUNITY_SUCCESS,
        null,
        responseModel
    );
    next();
};

const updateCommunityPresenter = async (req, res, next) => {
    const responseModel = new CommunityResponseModel(req.community);
    req.statusCode = CommunitySuccessResponses.UPDATE_COMMUNITY_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        CommunitySuccessResponses.UPDATE_COMMUNITY_SUCCESS,
        null,
        responseModel
    );
    next();
};

export {
    createCommunityPresenter,
    updateCommunityPresenter
}