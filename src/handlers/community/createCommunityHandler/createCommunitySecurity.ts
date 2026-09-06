import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IResponse } from "../../../helpers/api.js";
import { isEmpty } from "../../../helpers/isEmpty.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { CommunityErrorResponses } from "../../../responses/errors/CommunityErrorResponses.js";

export const createCommunitySecurity = (
    res: IResponse,
    communityByName: ICommunity,
    communityByFlag: ICommunity,
): IResponse | boolean => {
    if (!isEmpty(communityByName)) {
        return res
            .status(CommunityErrorResponses.COMMUNITY_NAME_ALREADY_EXISTS.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NAME_ALREADY_EXISTS, null));
    }
    if (!isEmpty(communityByFlag)) {
        return res
            .status(CommunityErrorResponses.COMMUNITY_FLAG_ALREADY_EXISTS.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_FLAG_ALREADY_EXISTS, null));
    }
    return true;
};
