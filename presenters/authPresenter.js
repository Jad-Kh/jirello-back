import { AuthResponseModel } from "../responses/models/auth/AuthResponseModel.js";
import { AuthSuccessResponses } from "../responses/messages/success/auth/authSuccessResponses.js";
import { prepareSuccessResponse } from "./common/successResponsePresenter.js";
import { SuccessResponseModel } from "../responses/models/API/successResponseModel.js";

const signUpPresenter = async (req, res, next) => {
    const responseModel = new AuthResponseModel(req.responseModel);
    req.statusCode = AuthSuccessResponses.SIGNUP_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        AuthSuccessResponses.SIGNUP_SUCCESS,
        null,
        responseModel
    );
    next();
};

const logInPresenter = async (req, res, next) => {
    const responseModel = new AuthResponseModel(req.responseModel);
    req.statusCode = AuthSuccessResponses.LOGIN_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        AuthSuccessResponses.LOGIN_SUCCESS,
        null,
        responseModel
    );
    next();
};

const recoveryPresenter = async (req, res, next) => {
    const responseModel = new SuccessResponseModel(req.responseModel);
    req.statusCode = AuthSuccessResponses.RECOVERY_SUCCESS.code;
    req.presenterModel = prepareSuccessResponse(
        AuthSuccessResponses.RECOVERY_SUCCESS,
        null,
        responseModel
    );
    next();
};

export {
    signUpPresenter,
    logInPresenter,
    recoveryPresenter
}