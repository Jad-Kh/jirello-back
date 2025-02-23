import { CreateRoleRequestModel } from "../requests/role/CreateRoleRequestModel.js";
import { RoleRequestModel } from "../requests/role/RoleRequestModel.js";
import { RoleByIdRequestModel } from "../requests/role/RoleByIdRequestModel.js";
import { AssignUserToRoleRequestModel } from "../requests/role/AssignUserToRoleRequestModel.js";
import {
  createRoleValidationScheme,
  updateRoleValidationScheme,
  roleByIdValidationScheme,
  assignUserToRoleValidationScheme, 
  removeUserFromRoleValidationScheme
} from "./schemes/roleValidationSchemes.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { RoleErrorResponses } from "../responses/messages/errors/role/roleErrorResponse.js";
import { RemoveUserFromRoleRequestModel } from "../requests/role/RemoveUserFromRoleRequestModel.js";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";

const createRoleValidator = (req, res, next) => {
  try {
    const bodyReceived = new CreateRoleRequestModel(req.body);
    const result = createRoleValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(RoleErrorResponses.CREATION_ERROR.code)
          .json(prepareErrorResponse(RoleErrorResponses.CREATION_ERROR, result?.error?.message));
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch(error) {
    prepareErrorLog(error, createRoleValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
        .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
  }
};

const updateRoleValidator = (req, res, next) => {
  try {
      const bodyReceived = new RoleRequestModel(req.body);
      const result = updateRoleValidationScheme.validate(bodyReceived);
      if (result.error) {
          return res.status(RoleErrorResponses.UPDATE_ERROR.code)
            .json(prepareErrorResponse(RoleErrorResponses.UPDATE_ERROR, result?.error?.message));
      } else {
          req.requestModel = bodyReceived;
          next();
      }
  } catch(error) {
      prepareErrorLog(error, updateRoleValidator.name);
      return res.status(CommonErrorResponses.SERVER_ERROR.code)
        .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));        
  }
};

const roleByIdValidator = (req, res, next) => {
  try {
    const bodyReceived = new RoleByIdRequestModel(req.params);
    const result = roleByIdValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(RoleErrorResponses.ID_ERROR.code)
        .json(prepareErrorResponse(RoleErrorResponses.ID_ERROR, result?.error?.message));
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, roleByIdValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
  }
};

const assignRoleToUserValidator = (req, res, next) => {
  try {
    const bodyReceived = new AssignUserToRoleRequestModel(req.body);
    const result = assignUserToRoleValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(RoleErrorResponses.ROLE_USER_ASSINGING_ERROR.code)
        .json(prepareErrorResponse(RoleErrorResponses.ROLE_USER_ASSINGING_ERROR, result?.error?.message));      
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, assignRoleToUserValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
  }
};

const removeUserFromRoleValidator = (req, res, next) => {
  try {
    const bodyReceived = new RemoveUserFromRoleRequestModel(req.body);
    const result = removeUserFromRoleValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(RoleErrorResponses.ROLE_USER_REMOVING_ERROR.code)
        .json(prepareErrorResponse(RoleErrorResponses.ROLE_USER_REMOVING_ERROR, result?.error?.message));      
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, removeUserFromRoleValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null)); 
  }
};

export {
    createRoleValidator,
    updateRoleValidator,
    roleByIdValidator,
    assignRoleToUserValidator,
    removeUserFromRoleValidator
}