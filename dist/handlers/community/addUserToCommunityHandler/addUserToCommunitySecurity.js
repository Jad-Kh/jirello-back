"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToCommunitySecurity = void 0;
const lodash_1 = require("lodash");
const CommunityErrorResponses_ts_1 = require("../../../responses/errors/CommunityErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const UserErrorResponses_ts_1 = require("../../../responses/errors/UserErrorResponses.ts");
const addUserToCommunitySecurity = (res, community, user, requestModel) => {
    if ((0, lodash_1.isEmpty)(community)) {
        return res.status(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
    }
    if ((0, lodash_1.isEmpty)(user)) {
        return res.status(UserErrorResponses_ts_1.UserErrorResponses.USER_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(UserErrorResponses_ts_1.UserErrorResponses.USER_NOT_FOUND, null));
    }
    if (community.userIds.includes(requestModel?.userId) || community.ownerIds.includes(requestModel?.ownerId)) {
        return res.status(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_USER_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_USER_FOUND, null));
    }
    return true;
};
exports.addUserToCommunitySecurity = addUserToCommunitySecurity;
