import { IResponse } from "../../../helpers/api.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { isEmpty } from "lodash";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { UserErrorResponses } from "../../../responses/errors/UserErrorResponses.js";

export const logOutSecurity = (res: IResponse, user: IUser): boolean | IResponse => {
    if(isEmpty(user)) {
        return res.status(UserErrorResponses.USER_NOT_FOUND.code)
            .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));
    }
    return true;
}