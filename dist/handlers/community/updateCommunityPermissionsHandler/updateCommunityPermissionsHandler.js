"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommunityPermissionsHandler = void 0;
const community_ts_1 = require("../../../database/queries/community.ts");
const updateCommunityPermissionsSecurity_ts_1 = require("./updateCommunityPermissionsSecurity.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const updateCommunityPermissionsHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(requestModel?.id);
        if ((0, security_ts_1.checkSecurity)((0, updateCommunityPermissionsSecurity_ts_1.updateCommunityPermissionsSecurity)(res, community))) {
            const { id, ...permissions } = requestModel;
            const updatedCommunity = await community_ts_1.CommunityQueries.updateCommunityPermissionsQuery(id, permissions);
            req.community = updatedCommunity;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.updateCommunityPermissionsHandler.name);
    }
};
exports.updateCommunityPermissionsHandler = updateCommunityPermissionsHandler;
