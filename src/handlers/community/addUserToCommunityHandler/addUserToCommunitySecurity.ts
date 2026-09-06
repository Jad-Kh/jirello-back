import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { IResponse } from "../../../helpers/api.js";
import { isEmpty } from "../../../helpers/isEmpty.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { CommunityErrorResponses } from "../../../responses/errors/CommunityErrorResponses.js";
import { UserErrorResponses } from "../../../responses/errors/UserErrorResponses.js";
import { AddUserToCommunityRequest } from "./addUserToCommunityRequest.js";

export const addUserToCommunitySecurity = (
    res: IResponse,
    community: ICommunity,
    user: IUser,
    requestModel?: AddUserToCommunityRequest,
): IResponse | boolean => {
    if (isEmpty(community)) {
        return res
            .status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
    }
    if (isEmpty(user)) {
        return res
            .status(UserErrorResponses.USER_NOT_FOUND.code)
            .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));
    }
    if (
        community.userIds.includes(requestModel?.userId as string) ||
        community.ownerIds.includes(requestModel?.userId as string)
    ) {
        return res
            .status(CommunityErrorResponses.COMMUNITY_USER_FOUND.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_USER_FOUND, null));
    }
    return true;
};
