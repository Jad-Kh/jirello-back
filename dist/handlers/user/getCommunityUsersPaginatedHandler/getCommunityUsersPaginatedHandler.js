"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityUsersPaginatedHandler = void 0;
const community_ts_1 = require("../../../database/queries/community.ts");
const getCommunityUsersPaginatedSecurity_ts_1 = require("./getCommunityUsersPaginatedSecurity.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const pagination_ts_1 = require("../../../helpers/pagination.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const getCommunityUsersPaginatedMapper_ts_1 = require("./getCommunityUsersPaginatedMapper.ts");
const getCommunityUsersPaginatedHandler = async (req, res, next) => {
    try {
        const communityId = req.requestModel?.id;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(communityId);
        if ((0, security_ts_1.checkSecurity)((0, getCommunityUsersPaginatedSecurity_ts_1.getCommunityUsersPaginatedSecurity)(res, community))) {
            const { skip, limit } = (0, pagination_ts_1.preparePagination)(req.query);
            const communityUsers = await user_ts_1.UserQueries.getUsersOfCommunityPaginatedQuery(communityId, skip, limit);
            const users = await (0, getCommunityUsersPaginatedMapper_ts_1.getCommunityUsersPaginatedMapper)(community, communityUsers);
            req.users = users;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getCommunityUsersPaginatedHandler.name);
    }
};
exports.getCommunityUsersPaginatedHandler = getCommunityUsersPaginatedHandler;
