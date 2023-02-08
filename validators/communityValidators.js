import { CommunityByIdRequestModel } from "../requests/community/CommunityByIdRequestModel.js";
import { communityByIdValidationScheme } from "./schemes/communityValidationSchemes.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommunityErrorResponses } from "../responses/messages/errors/community/communityErrorResponse.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorLog } from "../errorLog/errorLog.js"

const communityByIdValidator = (req, res, next) => {
    try {
      const bodyReceived = new CommunityByIdRequestModel(req.params.id);
      const result = communityByIdValidationScheme.validate(bodyReceived);
      if (result.error) {
        return res.status(CommunityErrorResponses.ID_ERROR.code)
          .json(prepareErrorResponse(CommunityErrorResponses.ID_ERROR, result?.error?.message));
      } else {
        req.requestModel = bodyReceived;
        next();
      }
    } catch (error) {
      prepareErrorLog(error, communityByIdValidator.name);
      return res.status(CommonErrorResponses.SERVER_ERROR.code)
        .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    communityByIdValidator
}