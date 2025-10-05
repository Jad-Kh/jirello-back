import { IResponse } from "../../../helpers/api.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { isEmpty } from "lodash";
import { AuthErrorResponses } from "../../../responses/errors/AuthErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";

export const recoverySecurity = (res: IResponse, user: IUser): boolean | IResponse => {
    if (isEmpty(user)) {
        return res.status(AuthErrorResponses.EMAIL_NOT_EXISTS_ERROR.code)
            .json(prepareErrorResponse(AuthErrorResponses.EMAIL_NOT_EXISTS_ERROR, null));
    }
    return true;
}