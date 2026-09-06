import { IRole } from "../../../database/models/role/IRole.js";
import { IResponse } from "../../../helpers/api.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { RoleErrorResponses } from "../../../responses/errors/RoleErrorResponses.js";

export const createRoleSecurity = (
    res: IResponse,
    roleByTitle: IRole,
    communityId: string,
): IResponse | boolean => {
    if (roleByTitle && roleByTitle.communityId === communityId) {
        return res
            .status(RoleErrorResponses.ROLE_NAME_ALREADY_EXISTS.code)
            .json(prepareErrorResponse(RoleErrorResponses.ROLE_NAME_ALREADY_EXISTS, null));
    }
    return true;
};
