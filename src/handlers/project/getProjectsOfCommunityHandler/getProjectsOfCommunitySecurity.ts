import { IResponse } from "../../../helpers/api.ts";
import { ICommunity } from "../../../database/models/community/ICommunity.ts";
import { isEmpty } from "lodash";
import { CommunityErrorResponses } from "../../../responses/errors/CommunityErrorResponses.ts";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.ts";

export const getProjectsOfCommunitySecurity = (res: IResponse, community: ICommunity): IResponse | boolean => {
    if (isEmpty(community)) {
        return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
    }
    return true;
};
