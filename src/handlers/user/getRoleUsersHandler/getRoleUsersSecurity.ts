import { IRole } from "../../../database/models/role/IRole.js";
import { IResponse } from "../../../helpers/api.js";
import { isEmpty } from "../../../helpers/isEmpty.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { RoleErrorResponses } from "../../../responses/errors/RoleErrorResponses.js";

export const getRoleUsersSecurity = (res: IResponse, role: IRole): IResponse | boolean => {
    if (isEmpty(role)) {
        return res
            .status(RoleErrorResponses.ROLE_NOT_FOUND.code)
            .json(prepareErrorResponse(RoleErrorResponses.ROLE_NOT_FOUND, null));
    }
    return true;
};
