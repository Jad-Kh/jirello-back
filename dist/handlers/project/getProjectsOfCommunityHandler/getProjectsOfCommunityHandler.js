"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectsOfCommunityHandler = void 0;
const community_ts_1 = require("../../../database/queries/community.ts");
const project_ts_1 = require("../../../database/queries/project.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const getProjectsOfCommunitySecurity_ts_1 = require("./getProjectsOfCommunitySecurity.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const getProjectsOfCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const communityId = requestModel?.id;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(communityId);
        if ((0, security_ts_1.checkSecurity)((0, getProjectsOfCommunitySecurity_ts_1.getProjectsOfCommunitySecurity)(res, community))) {
            const projects = await project_ts_1.ProjectQueries.getProjectsOfCommunityQuery(communityId);
            req.projects = projects;
            next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getProjectsOfCommunityHandler.name);
    }
};
exports.getProjectsOfCommunityHandler = getProjectsOfCommunityHandler;
