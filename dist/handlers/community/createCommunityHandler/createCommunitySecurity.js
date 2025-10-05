"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommunitySecurity = void 0;
const lodash_1 = require("lodash");
const CommunityErrorResponses_ts_1 = require("../../../responses/errors/CommunityErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const createCommunitySecurity = (res, communityByName, communityByFlag) => {
    if (!(0, lodash_1.isEmpty)(communityByName)) {
        return res.status(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_NAME_ALREADY_EXISTS.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_NAME_ALREADY_EXISTS, null));
    }
    if (!(0, lodash_1.isEmpty)(communityByFlag)) {
        return res.status(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_FLAG_ALREADY_EXISTS.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommunityErrorResponses_ts_1.CommunityErrorResponses.COMMUNITY_FLAG_ALREADY_EXISTS, null));
    }
    return true;
};
exports.createCommunitySecurity = createCommunitySecurity;
