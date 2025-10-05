import { IResponse } from "../../../helpers/api.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { isEmpty } from "lodash";
import { UserErrorResponses } from "../../../responses/errors/UserErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";

export const getUserByEmailSecurity = (res: IResponse, user: IUser): IResponse | boolean => {
    if (isEmpty(user)) {
        return res.status(UserErrorResponses.EMAIL_ERROR.code)
            .json(prepareErrorResponse(UserErrorResponses.EMAIL_ERROR, null));
    }
    return true;
};