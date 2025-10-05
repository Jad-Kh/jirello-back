"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommunityHandler = void 0;
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const community_ts_1 = require("../../../database/queries/community.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const createCommunitySecurity_ts_1 = require("./createCommunitySecurity.ts");
const createCommunityMapper_ts_1 = require("./createCommunityMapper.ts");
const CommunityResponse_ts_1 = require("../../../models/community/CommunityResponse.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const createCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const communityByName = await community_ts_1.CommunityQueries.getCommunityByNameQuery(requestModel?.name);
        const communityByFlag = await community_ts_1.CommunityQueries.getCommunityByFlagQuery(requestModel?.flag);
        if ((0, security_ts_1.checkSecurity)((0, createCommunitySecurity_ts_1.createCommunitySecurity)(res, communityByName, communityByFlag))) {
            const mappedCommunity = await (0, createCommunityMapper_ts_1.createCommunityMapper)(requestModel, req.userId);
            const newCommunity = new CommunityResponse_ts_1.CommunityResponse(mappedCommunity);
            const savedCommunity = await community_ts_1.CommunityQueries.createCommunityQuery(newCommunity);
            await user_ts_1.UserQueries.addCommunityToUserOwnedQuery(req.userId, savedCommunity._id.toString());
            req.community = savedCommunity;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.createCommunityHandler.name);
    }
};
exports.createCommunityHandler = createCommunityHandler;
