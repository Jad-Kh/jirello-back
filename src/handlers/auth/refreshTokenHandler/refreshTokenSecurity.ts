import { IResponse } from "../../../helpers/api.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { isEmpty } from "lodash";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../../../responses/errors/CommonErrorResponses.js";

export const refreshTokenSecurity = (res: IResponse, user: IUser): boolean | IResponse => {
    if (isEmpty(user) || user?.access?.refreshToken === '') {
        return res.status(CommonErrorResponses.UNAUTHORIZED.code)
            .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
    }
    return true;
}