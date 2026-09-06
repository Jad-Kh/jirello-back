import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IResponse } from "../../../helpers/api.js";
import { isEmpty } from "../../../helpers/isEmpty.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { CommunityErrorResponses } from "../../../responses/errors/CommunityErrorResponses.js";

export const updateCommunitySecurity = (
    res: IResponse,
    community: ICommunity,
    _userId: string,
): IResponse | boolean => {
    if (isEmpty(community)) {
        return res
            .status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
    }
    return true;
};
