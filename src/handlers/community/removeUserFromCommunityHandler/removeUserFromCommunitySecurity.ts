import { IResponse } from "../../../helpers/api.js";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { RemoveUserFromCommunityRequest } from "./removeUserFromCommunityRequest.js";
import { isEmpty } from "lodash";
import { CommunityErrorResponses } from "../../../responses/errors/CommunityErrorResponses.js";
import { prepareErrorResponse } from "../../../presenters/common/errorResponsePresenter.js";
import { UserErrorResponses } from "../../../responses/errors/UserErrorResponses.js";

export const removeUserFromCommunitySecurity = (res: IResponse, community: ICommunity, user: IUser, requestModel?: RemoveUserFromCommunityRequest): IResponse | boolean => {
    if (isEmpty(community)) {
        return res.status(CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
    }
    if (isEmpty(user)) {
        return res.status(UserErrorResponses.USER_NOT_FOUND.code)
            .json(prepareErrorResponse(UserErrorResponses.USER_NOT_FOUND, null));
    }
    if (!community.userIds.includes(requestModel?.userId as string) || !community.ownerIds.includes(requestModel?.ownerId as string)) {
        return res.status(CommunityErrorResponses.COMMUNITY_USER_NOT_FOUND.code)
            .json(prepareErrorResponse(CommunityErrorResponses.COMMUNITY_USER_NOT_FOUND, null));
    }
    return true;
};