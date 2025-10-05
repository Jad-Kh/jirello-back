import { isEmpty } from 'lodash';
import { IUser } from "../../../database/models/user/IUser.js";
import { AuthErrorResponses } from "../../../responses/errors/AuthErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { IResponse } from "../../../helpers/api.js";

export const signUpSecurity = (res: IResponse, userByEmail: IUser, userByUsername: IUser): IResponse | boolean  => {
    if(!isEmpty(userByEmail)) {
        return res.status(AuthErrorResponses.EMAIL_EXISTS_ERROR.code)
            .json(prepareErrorResponse(AuthErrorResponses.EMAIL_EXISTS_ERROR, null));
    }
    if(!isEmpty(userByUsername)) {
        return res.status(AuthErrorResponses.USERNAME_EXISTS_ERROR.code)
            .json(prepareErrorResponse(AuthErrorResponses.USERNAME_EXISTS_ERROR, null));
    }
    return true;
}