"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommunityHandler = void 0;
const community_ts_1 = require("../../../database/queries/community.ts");
const updateCommunitySecurity_ts_1 = require("./updateCommunitySecurity.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const updateCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(requestModel?.id);
        if ((0, security_ts_1.checkSecurity)((0, updateCommunitySecurity_ts_1.updateCommunitySecurity)(res, community, req.userId))) {
            const { id, ...updateModel } = requestModel;
            const updatedCommunity = await community_ts_1.CommunityQueries.updateCommunityQuery(id, updateModel);
            req.community = updatedCommunity;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.updateCommunityHandler.name);
    }
};
exports.updateCommunityHandler = updateCommunityHandler;
