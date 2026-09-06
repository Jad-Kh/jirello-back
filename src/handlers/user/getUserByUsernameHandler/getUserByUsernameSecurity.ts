import { IUser } from "../../../database/models/user/IUser.js";
import { IResponse } from "../../../helpers/api.js";
import { isEmpty } from "../../../helpers/isEmpty.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { UserErrorResponses } from "../../../responses/errors/UserErrorResponses.js";

export const getUserByUsernameSecurity = (res: IResponse, user: IUser): IResponse | boolean => {
    if (isEmpty(user)) {
        return res
            .status(UserErrorResponses.USERNAME_NOT_FOUND.code)
            .json(prepareErrorResponse(UserErrorResponses.USERNAME_NOT_FOUND, null));
    }
    return true;
};
