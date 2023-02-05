import { 
    getUserByEmailQuery, 
    getUserByUsernameQuery,
    createUserQuery
} from "../database/queries/user/userQueries.js";
import pkg from "lodash";
import bcrypt from "bcrypt";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { AuthErrorResponses } from "../responses/messages/errors/auth/authErrorResponses.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { CreateUserRequestModel } from "../requests/user/CreateUserRequestModel.js";

const { isEmpty } = pkg;

const signUpHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const userByEmail = await getUserByEmailQuery(requestModel.email);
        const userByUsername = await getUserByUsernameQuery(requestModel.username);
        if(!isEmpty(userByEmail)) {
            return res.status(AuthErrorResponses.EMAIL_EXISTS_ERROR.code)
                .json(prepareErrorResponse(AuthErrorResponses.EMAIL_EXISTS_ERROR, null));
        }
        else if(!isEmpty(userByUsername)) {
            return res.status(AuthErrorResponses.USERNAME_EXISTS_ERROR.code)
                .json(prepareErrorResponse(AuthErrorResponses.USERNAME_EXISTS_ERROR, null));
        } else {
            const isAdmin = false;
            const ownedCommunityIds = [];
            const taskIds = [];
            const taskGroupIds = [];
            const taskPerWeekAverage = 0;
            const tasks = { taskIds, taskGroupIds, taskPerWeekAverage };
            const mutedCommunitiyIds = [];
            const mutedChatIds = [];
            const muteAll = false;
            const notifications = { mutedCommunitiyIds, mutedChatIds, muteAll };
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(requestModel.password, salt);
            requestModel.password = hashedPassword;
            const newUserBody = { isAdmin, ownedCommunityIds, profile: requestModel, tasks, notifications };
            const newUser = new CreateUserRequestModel(newUserBody);
            const savedUser = await createUserQuery(newUser);
            req.user = savedUser;
            next();
        }
    } catch(error) {
        prepareErrorLog(error, signUpHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const logInHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const userByUsername = requestModel?.username && await getUserByUsernameQuery(requestModel?.username);
        const userByEmail = requestModel?.email && await getUserByEmailQuery(requestModel?.email);
        const user = userByUsername || userByEmail;
        const userError = requestModel?.username ? AuthErrorResponses.LOGIN_USERNAME_ERROR : AuthErrorResponses.LOGIN_EMAIL_ERROR;
        if (isEmpty(user)) {
            return res.status(userError.code)
                .json(prepareErrorResponse(userError, null));
        }
        const passwordValidation = await bcrypt.compare(requestModel.password, user.profile.password);
        if (!passwordValidation) {
            return res.status(userError.code)
                .json(prepareErrorResponse(userError, null));
        }
        req.user = user;
        next();
    } catch(error) {
        prepareErrorLog(error, logInHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    signUpHandler,
    logInHandler
}