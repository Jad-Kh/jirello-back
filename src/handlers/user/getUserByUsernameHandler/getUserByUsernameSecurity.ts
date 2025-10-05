import { IResponse } from "../../../helpers/api.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { isEmpty } from "lodash";
import { UserErrorResponses } from "../../../responses/errors/UserErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";

export const getUserByUsernameSecurity = (res: IResponse, user: IUser): IResponse | boolean => {
    if (isEmpty(user)) {
        return res.status(UserErrorResponses.USERNAME_NOT_FOUND.code)
            .json(prepareErrorResponse(UserErrorResponses.USERNAME_NOT_FOUND, null));
    }
    return true;
};