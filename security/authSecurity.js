import { generateJWT, generateJWTWithExpiration } from "../helpers/jwtkit.js";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";

const signUpSecurity = async (req, res, next) => {
    try {
        const user = req.user;
        const registeredToken = generateJWTWithExpiration(user);
        res.cookie("token", registeredToken);
        req.responseModel = { token: registeredToken, id: user._id };
        next();
    } catch (error) {
        prepareErrorLog(error, signUpSecurity.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const logInSecurity = async (req, res, next) => {
    try {
        const user = req.user;
        const registeredToken = generateJWTWithExpiration(user);
        res.cookie("token", registeredToken);
        req.responseModel = { token: registeredToken, id: user._id };
        next();
    } catch (error) {
        prepareErrorLog(error, logInSecurity.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    signUpSecurity,
    logInSecurity
}