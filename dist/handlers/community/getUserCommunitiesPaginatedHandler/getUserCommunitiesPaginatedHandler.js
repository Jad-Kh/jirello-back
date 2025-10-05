"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCommunitiesPaginatedHandler = void 0;
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const getUserCommunitiesPaginatedSecurity_ts_1 = require("./getUserCommunitiesPaginatedSecurity.ts");
const pagination_ts_1 = require("../../../helpers/pagination.ts");
const community_ts_1 = require("../../../database/queries/community.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const getUserCommunitiesPaginatedHandler = async (req, res, next) => {
    try {
        const userId = req.requestModel?.id;
        const user = await user_ts_1.UserQueries.getUserByIdQuery(userId);
        if ((0, security_ts_1.checkSecurity)((0, getUserCommunitiesPaginatedSecurity_ts_1.getUserCommunitiesPaginatedSecurity)(res, user))) {
            const { skip, limit } = (0, pagination_ts_1.preparePagination)(req.query);
            const communities = await community_ts_1.CommunityQueries.getCommunitiesOfUserPaginatedQuery(userId, skip, limit);
            req.communities = communities;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getUserCommunitiesPaginatedHandler.name);
    }
};
exports.getUserCommunitiesPaginatedHandler = getUserCommunitiesPaginatedHandler;
