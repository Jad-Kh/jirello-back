import { UserByEmailRequestModel } from "../requests/user/UserByEmailRequestModel";
import { UserByIdRequestModel } from "../requests/user/UserByIdRequestModel";
import { UserByUsernameRequestModel } from "../requests/user/UserByUsernameRequestModel";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse";
import { UserErrorResponses } from "../responses/messages/errors/user/userErrorResponse";
import { 
    getUserByEmailValidationScheme, 
    getUserByIdValidationScheme, 
    getUserByUsernameValidationScheme
} from "./schemes/userValidationSchemes";

const getUserByIdValidator = (req, res, next) => {
    try {
      const bodyReceived = new UserByIdRequestModel(req.params);
      const result = getUserByIdValidationScheme.validate(bodyReceived);
      if (result.error) {
        return res.status(UserErrorResponses.USER_NOT_FOUND.code)
          .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, result?.error?.message));
      } else {
        req.requestModel = bodyReceived;
        next();
      }
    } catch (error) {
      prepareErrorLog(error, getUserByIdValidator.name);
      return res.status(CommonErrorResponses.SERVER_ERROR.code)
        .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getUserByEmailValidator = (req, res, next) => {
    try {
      const bodyReceived = new UserByEmailRequestModel(req.params);
      const result = getUserByEmailValidationScheme.validate(bodyReceived);
      if (result.error) {
        return res.status(UserErrorResponses.EMAIL_ERROR.code)
          .json(prepareErrorResponse(UserErrorResponses.EMAIL_ERROR, result?.error?.message));
      } else {
        req.requestModel = bodyReceived;
        next();
      }
    } catch (error) {
      prepareErrorLog(error, getUserByEmailValidator.name);
      return res.status(CommonErrorResponses.SERVER_ERROR.code)
        .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const getUserByUsernameValidator = (req, res, next) => {
    try {
      const bodyReceived = new UserByUsernameRequestModel(req.params);
      const result = getUserByUsernameValidationScheme.validate(bodyReceived);
      if (result.error) {
        return res.status(UserErrorResponses.USERNAME_NOT_FOUND.code)
          .json(prepareErrorResponse(UserErrorResponses.USERNAME_NOT_FOUND, result?.error?.message));
      } else {
        req.requestModel = bodyReceived;
        next();
      }
    } catch (error) {
      prepareErrorLog(error, getUserByUsernameValidator.name);
      return res.status(CommonErrorResponses.SERVER_ERROR.code)
        .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    getUserByIdValidator,
    getUserByEmailValidator,
    getUserByUsernameValidator
}