import { IResponse } from "../../../helpers/api.js";
import { IRole } from "../../../database/models/role/IRole.js";
import { isEmpty } from "lodash";
import { RoleErrorResponses } from "../../../responses/errors/RoleErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";

export const getRoleUsersPaginatedSecurity = (res: IResponse, role: IRole): IResponse | boolean => {
    if (isEmpty(role)) {
        return res.status(RoleErrorResponses.ROLE_NOT_FOUND.code)
            .json(prepareErrorResponse(RoleErrorResponses.ROLE_NOT_FOUND, null));
    }
    return true;
};