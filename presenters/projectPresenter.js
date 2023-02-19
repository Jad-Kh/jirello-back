import { ProjectResponseModel } from "../responses/models/project/ProjectResponseModel.js";
import { ProjectSuccessResponses } from "../responses/messages/success/project/projectSuccessResponses.js";
import { prepareSuccessResponse } from "./common/successResponsePresenter.js";

const createProjectPresenter = async (req, res, next) => {
    const responseModel = new ProjectResponseModel(req.project);
    req.statusCode = ProjectSuccessResponses.CREATE_PROJECT_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        ProjectSuccessResponses.CREATE_PROJECT_SUCCESS,
        null,
        responseModel
    );
    next();
};

export {
    createProjectPresenter
}