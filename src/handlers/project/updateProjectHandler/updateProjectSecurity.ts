import { IResponse } from "../../../helpers/api.ts";
import { IProject } from "../../../database/models/project/IProject.ts";
import { isEmpty } from "lodash";
import { ProjectErrorResponses } from "../../../responses/errors/ProjectErrorResponses.ts";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.ts";
import { CommonErrorResponses } from "../../../responses/errors/CommonErrorResponses.ts";

export const updateProjectSecurity = (res: IResponse, project: IProject, userId: string): IResponse | boolean => {
    if (isEmpty(project)) {
        return res.status(ProjectErrorResponses.PROJECT_NOT_FOUND.code)
            .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_NOT_FOUND, null));
    }
    if (!project.organizerIds.includes(userId)) {
        return res.status(CommonErrorResponses.UNAUTHORIZED.code)
            .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
    }
    return true;
};
