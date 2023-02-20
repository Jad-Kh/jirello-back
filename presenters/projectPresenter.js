import { ProjectResponseModel } from "../responses/models/project/ProjectResponseModel.js";
import { ProjectSuccessResponses } from "../responses/messages/success/project/projectSuccessResponses.js";
import { prepareSuccessResponse } from "./common/successResponsePresenter.js";
import { ProjectsOfCommunityResponseModel } from "../responses/models/project/ProjectsOfCommunityResponseModel.js";

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

const getProjectsOfCommunityPresenter = async (req, res, next) => {
    const responseModel = new ProjectsOfCommunityResponseModel(req.projects);
    req.statusCode = ProjectSuccessResponses.PROJECTS_OF_COMMUNITY_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        ProjectSuccessResponses.PROJECTS_OF_COMMUNITY_SUCCESS,
        null,
        responseModel
    );
    next();
};

export {
    createProjectPresenter,
    getProjectsOfCommunityPresenter
}