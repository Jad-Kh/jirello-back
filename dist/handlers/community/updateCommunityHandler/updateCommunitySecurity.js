"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommunitySecurity = void 0;
const lodash_1 = require("lodash");
const CommunityErrorResponses_ts_1 = require("../../../responses/errors/CommunityErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const CommonErrorResponses_ts_1 = require("../../../responses/errors/CommonErrorResponses.ts");
const updateCommunitySecurity = (res, community, userId) => {
    if ((0, lodash_1.isEmpty)(community)) {
        return res.status(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_NOT_FOUND, null));
    }
    if (!community.ownerIds.includes(userId)) {
        return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, null));
    }
    return true;
};
exports.updateCommunitySecurity = updateCommunitySecurity;
