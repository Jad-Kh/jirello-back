import { IResponse } from "../../../helpers/api.js";
import { IRole } from "../../../database/models/role/IRole.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { isEmpty } from "lodash";
import { RoleErrorResponses } from "../../../responses/errors/RoleErrorResponses.js";
import { UserErrorResponses } from "../../../responses/errors/UserErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";

export const assignRoleToUserSecurity = (res: IResponse, role: IRole, user: IUser, userId: string): IResponse | boolean => {
    if (isEmpty(role)) {
        return res.status(RoleErrorResponses.ROLE_NOT_FOUND.code)
            .json(prepareErrorResponse(RoleErrorResponses.ROLE_NOT_FOUND, null));
    }
    if (isEmpty(user)) {
        return res.status(UserErrorResponses.USER_NOT_FOUND.code)
            .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));
    }
    if (role.userIds.includes(userId)) {
        return res.status(RoleErrorResponses.ROLE_USER_FOUND.code)
            .json(prepareErrorResponse(RoleErrorResponses.ROLE_USER_FOUND, null));
    }
    return true;
};