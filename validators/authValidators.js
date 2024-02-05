import { SignUpRequestModel } from "../requests/auth/SignUpRequestModel.js";
import { LogInRequestModel } from "../requests/auth/LogInRequestModel.js";
import {
  signUpValidationScheme,
  logInValidationScheme,
  recoveryValidationScheme, refreshTokenValidationScheme, logoutValidationScheme
} from "./schemes/authValidationSchemes.js";
import { parseUsernameOrEmail } from "../helpers/logIn.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { AuthErrorResponses } from "../responses/messages/errors/auth/authErrorResponses.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorLog } from "../errorLog/errorLog.js"
import { RecoveryRequestModel } from "../requests/auth/RecoveryRequestModel.js";
import { RefreshTokenRequestModel } from "../requests/auth/RefreshTokenRequestModel.js";
import { UserErrorResponses } from "../responses/messages/errors/user/userErrorResponse.js";
import { LogoutRequestModel } from "../requests/auth/LogoutRequestModel.js";

const signUpValidator = (req, res, next) => {
  try {
    const bodyReceived = new SignUpRequestModel(req.body);
    const result = signUpValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(AuthErrorResponses.SIGNUP_VALIDATION_ERROR.code)
        .json(prepareErrorResponse(AuthErrorResponses.SIGNUP_VALIDATION_ERROR, result?.error?.message));
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, signUpValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
  }
};

const logInValidator = (req, res, next) => {
  try {
    const data = parseUsernameOrEmail(req.body)
    const bodyReceived = new LogInRequestModel(data);
    const result = logInValidationScheme.validate(bodyReceived);
    if (result.error) {
      return res.status(AuthErrorResponses.LOGIN_VALIDATION_ERROR.code)
        .json(prepareErrorResponse(AuthErrorResponses.LOGIN_VALIDATION_ERROR, result?.error?.message));
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, logInValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
  }
};

const recoveryValidator = (req, res, next) => {
  try {
    const bodyReceived = new RecoveryRequestModel(req.params);
    const result = recoveryValidationScheme.validate(bodyReceived);
    if(result.error) {
      return res.status(AuthErrorResponses.INVALID_EMAIL.code)
        .json(prepareErrorResponse(AuthErrorResponses.INVALID_EMAIL, result?.error?.message));
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, recoveryValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
      .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
  }
};

const refreshTokenValidator = (req, res, next) => {
  try {
    const bodyReceived = new RefreshTokenRequestModel(req.body);
    const result = refreshTokenValidationScheme.validate(bodyReceived);
    if(result.error) {
      return res.status(UserErrorResponses.USER_NOT_FOUND.code)
          .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, result?.error?.message));
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, refreshTokenValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
        .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
  }
};

const logoutValidator = (req, res, next) => {
  try {
    const bodyReceived = new LogoutRequestModel(req.body);
    const result = logoutValidationScheme.validate(bodyReceived);
    if(result.error) {
      return res.status(UserErrorResponses.USER_NOT_FOUND.code)
          .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, result?.error?.message));
    } else {
      req.requestModel = bodyReceived;
      next();
    }
  } catch (error) {
    prepareErrorLog(error, logoutValidator.name);
    return res.status(CommonErrorResponses.SERVER_ERROR.code)
        .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
  }
};

export {
  signUpValidator,
  logInValidator,
  recoveryValidator,
  refreshTokenValidator,
  logoutValidator
}