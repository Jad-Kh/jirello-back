import { IProject } from "../../../database/models/project/IProject.js";
import { IResponse } from "../../../helpers/api.js";
import { isEmpty } from "../../../helpers/isEmpty.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { ProjectErrorResponses } from "../../../responses/errors/ProjectErrorResponses.js";

export const updateProjectSecurity = (
    res: IResponse,
    project: IProject,
    _userId: string,
): IResponse | boolean => {
    if (isEmpty(project)) {
        return res
            .status(ProjectErrorResponses.PROJECT_NOT_FOUND.code)
            .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_NOT_FOUND, null));
    }
    return true;
};
