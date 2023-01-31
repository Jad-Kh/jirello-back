import { generateJWT } from "../helpers/jwtkit.js";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";

const signUpSecurity = async (req, res, next) => {
    try {
        const user = req.user;
        const registeredToken = await generateJWT(user);
        res.cookie("token", registeredToken);
        req.responseModel = { token: registeredToken, id: user._id };
        next();
    } catch (error) {
        prepareErrorLog(error, signUpSecurity.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    signUpSecurity
}