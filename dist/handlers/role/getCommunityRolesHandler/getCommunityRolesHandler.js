"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityRolesHandler = void 0;
const community_ts_1 = require("../../../database/queries/community.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const getCommunityRolesSecurity_ts_1 = require("./getCommunityRolesSecurity.ts");
const role_ts_1 = require("../../../database/queries/role.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const getCommunityRolesHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(requestModel?.id);
        if ((0, security_ts_1.checkSecurity)((0, getCommunityRolesSecurity_ts_1.getCommunityRolesSecurity)(res, community))) {
            const roles = await role_ts_1.RoleQueries.getRolesOfCommunityQuery(requestModel?.id);
            req.roles = roles;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getCommunityRolesHandler.name);
    }
};
exports.getCommunityRolesHandler = getCommunityRolesHandler;
