"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityUsersHandler = void 0;
const community_ts_1 = require("../../../database/queries/community.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const getCommunityUsersSecurity_ts_1 = require("./getCommunityUsersSecurity.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const getCommunityUsersHandler = async (req, res, next) => {
    try {
        const communityId = req.requestModel?.id;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(communityId);
        if ((0, security_ts_1.checkSecurity)((0, getCommunityUsersSecurity_ts_1.getCommunityUsersSecurity)(res, community))) {
            const communityUsers = await user_ts_1.UserQueries.getUsersOfCommunityQuery(communityId);
            const users = communityUsers.map(user => {
                const role = community.ownerIds.includes(user._id) ? "owner" : "user";
                return { user, role };
            });
            req.users = users;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getCommunityUsersHandler.name);
    }
};
exports.getCommunityUsersHandler = getCommunityUsersHandler;
