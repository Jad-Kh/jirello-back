"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToCommunityHandler = void 0;
const community_ts_1 = require("../../../database/queries/community.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const addUserToCommunitySecurity_ts_1 = require("./addUserToCommunitySecurity.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const addUserToCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(requestModel?.communityId);
        const user = await user_ts_1.UserQueries.getUserByIdQuery(requestModel?.userId);
        if ((0, security_ts_1.checkSecurity)((0, addUserToCommunitySecurity_ts_1.addUserToCommunitySecurity)(res, community, user, requestModel))) {
            await community_ts_1.CommunityQueries.addUserToCommunityQuery(requestModel?.communityId, requestModel?.userId);
            await user_ts_1.UserQueries.addCommunityToUserQuery(requestModel?.userId, requestModel?.communityId);
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.addUserToCommunityHandler.name);
    }
};
exports.addUserToCommunityHandler = addUserToCommunityHandler;
