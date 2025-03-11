import { CreateProjectRequestModel } from "../requests/project/CreateProjectRequestModel.js";
import { ProjectRequestModel } from "../requests/project/ProjectRequestModel.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { ProjectErrorResponses } from "../responses/messages/errors/project/projectErrorResponses.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { createProjectValidationScheme, updateProjectValidationScheme } from "./schemes/projectValidationSchemes.js";

const createProjectValidator = (req, res, next) => {
    try {
        const bodyReceived = new CreateProjectRequestModel(req.body);
        const result = createProjectValidationScheme.validate(bodyReceived);
        if (result.error) {
            return res.status(ProjectErrorResponses.CREATION_ERROR.code)
              .json(prepareErrorResponse(ProjectErrorResponses.CREATION_ERROR, result?.error?.message));
        } else {
            req.requestModel = bodyReceived;
            next();
        }
    } catch(error) {
        prepareErrorLog(error, createProjectValidator.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const updateProjectValidator = (req, res, next) => {
    try {
        const bodyReceived = new ProjectRequestModel(req.body);
        const result = updateProjectValidationScheme.validate(bodyReceived);
        if (result.error) {
            return res.status(ProjectErrorResponses.PROJECT_UPDATE_ERROR.code)
              .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_UPDATE_ERROR, result?.error?.message));
        } else {
            if(!req.params.id) {
                return res.status(ProjectErrorResponses.PROJECT_NOT_FOUND.code)
                  .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_NOT_FOUND, null));
            }
            bodyReceived.id = req.params.id;
            req.requestModel = bodyReceived;
            next();
        }
    } catch(error) {
        prepareErrorLog(error, updateProjectValidator.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));        
    }
};

export {
    createProjectValidator,
    updateProjectValidator
};