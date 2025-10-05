"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProjectToCommunityHandler = void 0;
const community_ts_1 = require("../../../database/queries/community.ts");
const project_ts_1 = require("../../../database/queries/project.ts");
const addProjectToCommunitySecurity_ts_1 = require("./addProjectToCommunitySecurity.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const addProjectToCommunityHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(requestModel?.communityId);
        const project = await project_ts_1.ProjectQueries.getProjectByIdQuery(requestModel?.projectId);
        if ((0, security_ts_1.checkSecurity)((0, addProjectToCommunitySecurity_ts_1.addProjectToCommunitySecurity)(res, community, project))) {
            await community_ts_1.CommunityQueries.addProjectToCommunityQuery(requestModel?.communityId, requestModel?.projectId);
            await project_ts_1.ProjectQueries.updateProjectCommunityQuery(requestModel?.projectId, requestModel?.communityId);
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.addProjectToCommunityHandler.name);
    }
};
exports.addProjectToCommunityHandler = addProjectToCommunityHandler;
