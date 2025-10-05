import { IResponse } from "../../../helpers/api.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { isEmpty } from "lodash";
import { AuthErrorResponses } from "../../../responses/errors/AuthErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import bcrypt from "bcrypt";
import { UserErrorResponses } from "../../../responses/errors/UserErrorResponses.js";

export const logInSecurity = async (res: IResponse, user: IUser, userPassword?: string, username?: string): Promise<boolean | IResponse> => {
    const userError = username ? AuthErrorResponses.LOGIN_USERNAME_ERROR : AuthErrorResponses.LOGIN_EMAIL_ERROR;
    if (isEmpty(user)) {
        return res.status(userError.code)
            .json(prepareErrorResponse(userError, null));
    }
    if(!userPassword) {
        return res.status(AuthErrorResponses.LOGIN_VALIDATION_ERROR.code)
            .json(prepareErrorResponse(AuthErrorResponses.LOGIN_VALIDATION_ERROR, null));
    }
    const passwordValidation = await bcrypt.compare(userPassword, user.profile.password);
    if (!passwordValidation) {
        return res.status(AuthErrorResponses.LOGIN_VALIDATION_ERROR.code)
            .json(prepareErrorResponse(AuthErrorResponses.LOGIN_VALIDATION_ERROR, null));
    }
    if(isEmpty(user.id)) {
        return res.status(UserErrorResponses.USER_NOT_FOUND.code)
            .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));
    }
    return true;
};