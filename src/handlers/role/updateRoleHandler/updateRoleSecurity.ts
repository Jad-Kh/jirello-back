import { IRole } from "../../../database/models/role/IRole.js";
import { IResponse } from "../../../helpers/api.js";
import { isEmpty } from "../../../helpers/isEmpty.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { ProjectErrorResponses } from "../../../responses/errors/ProjectErrorResponses.js";
import { RoleErrorResponses } from "../../../responses/errors/RoleErrorResponses.js";

export const updateRoleSecurity = (res: IResponse, role: IRole): IResponse | boolean => {
    if (isEmpty(role)) {
        return res
            .status(RoleErrorResponses.ROLE_NOT_FOUND.code)
            .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_NOT_FOUND, null));
    }
    return true;
};
