import { CommunityByIdRequestModel } from "../requests/community/CommunityByIdRequestModel.js";
import { CreateCommunityRequestModel } from "../requests/community/CreateCommunityRequestModel.js";
import { 
  addProjectToCommunityValidationScheme,
  addUserToCommunityValidationScheme,
  communityByIdValidationScheme, 
  createCommunityValidationScheme, 
  removeUserFromCommunityValidationScheme, 
  updateCommunityValidationScheme 
} from "./schemes/communityValidationSchemes.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommunityErrorResponses } from "../responses/messages/errors/community/communityErrorResponse.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorLog } from "../errorLog/errorLog.js"
import { UpdateCommunityRequestModel } from "../requests/community/UpdateCommunityRequestModel.js";
import { AddUserToCommunityRequestModel } from "../requests/community/AddUserToCommunityRequestModel.js";
import { RemoveUserFromCommunityRequestModel } from "../requests/community/RemoveUserFromCommunityRequestModel.js";
import { AddProjectToCommunityRequestModel } from "../requests/community/AddProjectToCommunityRequestModel.js";
import { RemoveProjectFromCommunityRequestModel } from "../requests/community/RemoveProjectFromCommunityRequestModel.js";

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
  } catch (error) {
    prepareErrorLog(error, updateCommunityValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
  }
};

const addUserToCommunityValidator = (req, res, next) => {
  try {
    const bodyReceived = new AddUserToCommunityRequestModel(req.body);
    const result = addUserToCommunityValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(CommunityErrorResponses.COMMUNITY_USER_ADDING_ERROR.code)
        .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_USER_ADDING_ERROR, result?.error?.message));      
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, addUserToCommunityValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
  }
};

const removeUserFromCommunityValidator = (req, res, next) => {
  try {
    const bodyReceived = new RemoveUserFromCommunityRequestModel(req.body);
    const result = removeUserFromCommunityValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(CommunityErrorResponses.COMMUNITY_USER_REMOVING_ERROR.code)
        .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_USER_REMOVING_ERROR, result?.error?.message));      
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, removeUserFromCommunityValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
  }
};

const addProjectToCommunityValidator = (req, res, next) => {
  try {
    const bodyReceived = new AddProjectToCommunityRequestModel(req.body);
    const result = addProjectToCommunityValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(CommonErrorResponses.REQUIRED.code)
        .json(prepareErrorResponse(CommonErrorResponses.REQUIRED, result?.error?.message));      
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, addProjectToCommunityValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
  }
};

const removeProjectFromCommunityValidator = (req, res, next) => {
  try {
    const bodyReceived = new RemoveProjectFromCommunityRequestModel(req.body);
    const result = addProjectToCommunityValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(CommonErrorResponses.REQUIRED.code)
        .json(prepareErrorResponse(CommonErrorResponses.REQUIRED, result?.error?.message));      
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, removeProjectFromCommunityValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
  }
};

export {
    communityByIdValidator,
    createCommunityValidator,
    updateCommunityValidator,
    addUserToCommunityValidator,
    removeUserFromCommunityValidator,
    addProjectToCommunityValidator,
    removeProjectFromCommunityValidator
}