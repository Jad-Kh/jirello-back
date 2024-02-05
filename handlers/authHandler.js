import {
    getUserByEmailQuery,
    getUserByUsernameQuery,
    createUserQuery, getUserAccessByIdQuery, updateUserAccessQuery, getUserByIdQuery, removeUserAccessQuery
} from "../database/queries/user/userQueries.js";
import pkg from "lodash";
import bcrypt from "bcrypt";
import { prepareErrorLog } from "../errorLog/errorLog.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { AuthErrorResponses } from "../responses/messages/errors/auth/authErrorResponses.js";
import { CommonErrorResponses } from "../responses/messages/errors/common/commonErrorResponse.js";
import { CreateUserRequestModel } from "../requests/user/CreateUserRequestModel.js";
import {generateJWT, generateJWTWithExpiration} from "../helpers/jwtkit.js";
import {UserErrorResponses} from "../responses/messages/errors/user/userErrorResponse.js";

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
            const communityIds = [];
            const ownedCommunityIds = [];
            const taskIds = [];
            const taskGroupIds = [];
            const taskPerWeekAverage = 0;
            const tasks = { taskIds, taskGroupIds, taskPerWeekAverage };
            const mutedCommunityIds = [];
            const mutedChatIds = [];
            const muteAll = false;
            const notifications = { mutedCommunityIds: mutedCommunityIds, mutedChatIds, muteAll };
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(requestModel.password, salt);
            requestModel.password = hashedPassword;
            const newUserBody = { isAdmin, communityIds, ownedCommunityIds, profile: requestModel, tasks, notifications };
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
        const refreshToken = generateJWT(user);
        await updateUserAccessQuery(user.id, refreshToken);
        req.user = user;
        next();
    } catch(error) {
        prepareErrorLog(error, logInHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const recoveryHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const user = requestModel?.email && await getUserByEmailQuery(requestModel?.email);
        if (isEmpty(user)) {
            return res.status(AuthErrorResponses.EMAIL_NOT_EXISTS_ERROR.code)
                .json(prepareErrorResponse(AuthErrorResponses.EMAIL_NOT_EXISTS_ERROR, null));
        }
        req.user = user;
        next();
    } catch(error) {
        prepareErrorLog(error, recoveryHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
          .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const refreshTokenHandler = async (req, res, next) => {
    try {
        const userId = req.requestModel.id;
        const access = await getUserAccessByIdQuery(userId);
        if(isEmpty(access) || access?.refreshToken === '') {
            return res.status(CommonErrorResponses.UNAUTHORIZED.code)
                .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
        } else {
            const updatedToken = generateJWTWithExpiration({id: userId});
            if(updatedToken) {
                req.token = updatedToken;
                next();
            } else {
                return res.status(CommonErrorResponses.SERVER_ERROR.code)
                    .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
            }
        }
    } catch(error) {
        prepareErrorLog(error, refreshTokenHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

const logoutHandler = async (req, res, next) => {
    try {
        const userId = req.requestModel.id;
        const user = await getUserByIdQuery(userId);
        if(isEmpty(user)) {
            return res.status(UserErrorResponses.USER_NOT_FOUND.code)
                .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));
        } else {
            await removeUserAccessQuery(userId);
            next();
        }
    } catch(error) {
        prepareErrorLog(error, logoutHandler.name);
        return res.status(CommonErrorResponses.SERVER_ERROR.code)
            .json(prepareErrorResponse(CommonErrorResponses.SERVER_ERROR, null));
    }
};

export {
    signUpHandler,
    logInHandler,
    recoveryHandler,
    refreshTokenHandler,
    logoutHandler
}