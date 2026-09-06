import { ICommunity } from "../database/models/community/ICommunity.js";
import { IResponse } from "../helpers/api.js";
import { prepareErrorResponse } from "../presenters/common/errorResponsePresenter.js";
import { CommonErrorResponses } from "../responses/errors/CommonErrorResponses.js";

export function isCommunityMember(community: ICommunity, userId: string): boolean {
    return [...community.ownerIds, ...community.userIds].map(String).includes(userId);
}

export function belongsToCommunity(resourceCommunityId: unknown, community: ICommunity): boolean {
    return String(resourceCommunityId) === community.id;
}

export function authorizeResourceCommunity(
    response: IResponse,
    activeCommunity: ICommunity | null | undefined,
    resourceCommunityId: unknown,
): boolean {
    if (activeCommunity && belongsToCommunity(resourceCommunityId, activeCommunity)) return true;
    response
        .status(403)
        .json(prepareErrorResponse(CommonErrorResponses.FORBIDDEN, "Cross-community access denied."));
    return false;
}

export function authorizeCommunityMember(
    response: IResponse,
    activeCommunity: ICommunity | null | undefined,
    userId: string,
): boolean {
    if (activeCommunity && isCommunityMember(activeCommunity, userId)) return true;
    response
        .status(403)
        .json(
            prepareErrorResponse(
                CommonErrorResponses.FORBIDDEN,
                "User is not a member of the active community.",
            ),
        );
    return false;
}
