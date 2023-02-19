import { CreateProjectRequestModel } from "../requests/project/CreateProjectRequestModel.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { ProjectErrorResponses } from "../responses/messages/errors/project/projectErrorResponses.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorLog } from "../errorLog/errorLog.js"
import { createProjectValidationScheme } from "./schemes/projectValidationSchemes.js";

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

export {
    createProjectValidator
}