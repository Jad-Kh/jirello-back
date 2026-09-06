import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IProject } from "../../../database/models/project/IProject.js";
import { IResponse } from "../../../helpers/api.js";
import { isEmpty } from "../../../helpers/isEmpty.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { CommunityErrorResponses } from "../../../responses/errors/CommunityErrorResponses.js";
import { ProjectErrorResponses } from "../../../responses/errors/ProjectErrorResponses.js";

export const createProjectSecurity = (
    res: IResponse,
    community: ICommunity,
    _userId: string,
    project: IProject,
): IResponse | boolean => {
    if (isEmpty(community)) {
        return res
            .status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
    }
    if (!isEmpty(project)) {
        return res
            .status(ProjectErrorResponses.PROJECT_NAME_ALREADY_EXISTS.code)
            .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_NAME_ALREADY_EXISTS, null));
    }
    return true;
};
