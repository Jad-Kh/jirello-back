import { CommunityByIdRequestModel } from "../requests/community/CommunityByIdRequestModel.js";
import { CreateCommunityRequestModel } from "../requests/community/CreateCommunityRequestModel.js";
import { 
  communityByIdValidationScheme, 
  createCommunityValidationScheme, 
  updateCommunityValidationScheme 
} from "./schemes/communityValidationSchemes.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommunityErrorResponses } from "../responses/messages/errors/community/communityErrorResponse.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorLog } from "../errorLog/errorLog.js"
import { UpdateCommunityRequestModel } from "../requests/community/UpdateCommunityRequestModel.js";

const communityByIdValidator = (req, res, next) => {
    try {
      const bodyReceived = new CommunityByIdRequestModel(req.params);
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

const createCommunityValidator = (req, res, next) => {
  try {
    const bodyReceived = new CreateCommunityRequestModel(req.body);
    const result = createCommunityValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(CommunityErrorResponses.CREATION_ERROR.code)
        .json(prepareErrorResponse(CommunityErrorResponses.CREATION_ERROR, result?.error?.message));      
    } else {
      req.requestModel = bodyReceived;
      next();
    }  
  } catch (error) {
    prepareErrorLog(error, createCommunityValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));    
  }
};

const updateCommunityValidator = (req, res, next) => {
  try {
    const bodyReceived = new UpdateCommunityRequestModel(req.body);
    const result = updateCommunityValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(CommunityErrorResponses.UPDATE_ERROR.code)
        .json(prepareErrorResponse(CommunityErrorResponses.UPDATE_ERROR, result?.error?.message));      
    } else {
      req.requestModel = bodyReceived;
      next();
    }  
  } catch(error) {
    prepareErrorLog(error, updateCommunityValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
  }
};

export {
    communityByIdValidator,
    createCommunityValidator,
    updateCommunityValidator
}