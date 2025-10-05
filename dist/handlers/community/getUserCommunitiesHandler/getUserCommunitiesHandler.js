"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCommunitiesHandler = void 0;
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const getUserCommunitiesSecurity_ts_1 = require("./getUserCommunitiesSecurity.ts");
const community_ts_1 = require("../../../database/queries/community.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const getUserCommunitiesHandler = async (req, res, next) => {
    try {
        const userId = req.requestModel?.id;
        const user = await user_ts_1.UserQueries.getUserByIdQuery(userId);
        if ((0, security_ts_1.checkSecurity)((0, getUserCommunitiesSecurity_ts_1.getUserCommunitiesSecurity)(res, user))) {
            const communities = await community_ts_1.CommunityQueries.getCommunitiesOfUserQuery(userId);
            req.communities = communities;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getUserCommunitiesHandler.name);
    }
};
exports.getUserCommunitiesHandler = getUserCommunitiesHandler;
