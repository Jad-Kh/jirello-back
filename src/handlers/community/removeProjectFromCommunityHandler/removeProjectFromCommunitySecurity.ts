import { IResponse } from "../../../helpers/api.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IProject } from "../../../database/models/project/IProject.js";
import { isEmpty } from "lodash";
import { CommunityErrorResponses } from "../../../responses/errors/CommunityErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { ProjectErrorResponses } from "../../../responses/errors/ProjectErrorResponses.js";

export const removeProjectFromCommunitySecurity = (res: IResponse, community: ICommunity | null, project: IProject | null): IResponse | boolean => {
    if (isEmpty(community)) {
        return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
    }
    if (isEmpty(project)) {
        return res.status(ProjectErrorResponses.PROJECT_NOT_FOUND.code)
            .json(prepareErrorResponse(ProjectErrorResponses.PROJECT_NOT_FOUND, null));
    }
    return true;
};
