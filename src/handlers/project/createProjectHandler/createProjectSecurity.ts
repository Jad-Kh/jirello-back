import { IResponse } from "../../../helpers/api.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { isEmpty } from "lodash";
import { CommunityErrorResponses } from "../../../responses/errors/CommunityErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../../../responses/errors/CommonErrorResponses.js";
import { ProjectErrorResponses } from "../../../responses/errors/ProjectErrorResponses.js";
import { IProject } from "../../../database/models/project/IProject.js";

export const createProjectSecurity = (res: IResponse, community: ICommunity, userId: string, project: IProject): IResponse | boolean => {
    if (isEmpty(community)) {
        return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
    }
    if (!community.ownerIds.includes(userId)) {
        return res.status(CommonErrorResponses.UNAUTHORIZED.code)
            .json(prepareErrorResponse(CommonErrorResponses.UNAUTHORIZED, null));
    }
    if (!isEmpty(project)) {
        return res.status(ProjectErrorResponses.PROJECT_NAME_ALREADY_EXISTS.code)
            .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_NAME_ALREADY_EXISTS, null));
    }
    return true;
};
