import { RoleByIdRequestModel } from "../requests/role/RoleByIdRequestModel.js";
import { AssignUserToRoleRequestModel } from "../requests/role/AssignUserToRoleRequestModel.js";
import { 
  roleByIdValidationScheme,
  assignUserToRoleValidationScheme 
} from "./schemes/roleValidationSchemes.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse";
import { RoleErrorResponses } from "../responses/messages/errors/role/roleErrorResponse";

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

export {
    roleByIdValidator,
    assignRoleToUserValidator
}