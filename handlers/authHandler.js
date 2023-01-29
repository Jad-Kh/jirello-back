import { 
    getUserByEmail, 
    getUserByUsername,
    createUser
} from "../database/queries/user/userQueries.js";
import { isEmpty } from "lodash";
import { AuthErrorResponses } from "../responses/messages/errors/auth/authErrorResponses.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";

const signUpHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const userByEmail = await getUserByEmail(requestModel.email);
        const userByUsername = await getUserByUsername(requestModel.username);
        if(!isEmpty(userByEmail)) {
            return res.status(AuthErrorResponses.EMAIL_EXISTS_ERROR.code)
                .json(prepareErrorResponse(AuthErrorResponses.EMAIL_EXISTS_ERROR, null));
        }
        else if(!isEmpty(userByUsername)) {
            return res.status(AuthErrorResponses.USERNAME_EXISTS_ERROR.code)
                .json(prepareErrorResponse(AuthErrorResponses.USERNAME_EXISTS_ERROR, null));
        } else {
            const savedUser = await createUser(requestModel);
            req.user = savedUser;
            next();
        }
    } catch(error) {
        prepareErrorLog(error, signUpHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
}