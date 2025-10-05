"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromCommunityHandler = void 0;
const community_ts_1 = require("../../../database/queries/community.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const removeUserFromCommunitySecurity_ts_1 = require("./removeUserFromCommunitySecurity.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const removeUserFromCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(requestModel?.communityId);
        const user = await user_ts_1.UserQueries.getUserByIdQuery(requestModel?.userId);
        if ((0, security_ts_1.checkSecurity)((0, removeUserFromCommunitySecurity_ts_1.removeUserFromCommunitySecurity)(res, community, user, requestModel))) {
            await community_ts_1.CommunityQueries.removeUserFromCommunityQuery(requestModel?.communityId, requestModel?.userId);
            await user_ts_1.UserQueries.removeCommunityFromUserQuery(requestModel?.userId, requestModel?.communityId);
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.removeUserFromCommunityHandler.name);
    }
};
exports.removeUserFromCommunityHandler = removeUserFromCommunityHandler;
