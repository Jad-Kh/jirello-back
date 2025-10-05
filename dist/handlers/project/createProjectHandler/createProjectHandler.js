"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectHandler = void 0;
const security_ts_1 = require("../../../helpers/security.ts");
const createProjectSecurity_ts_1 = require("./createProjectSecurity.ts");
const community_ts_1 = require("../../../database/queries/community.ts");
const project_ts_1 = require("../../../database/queries/project.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const createProjectMapper_ts_1 = require("./createProjectMapper.ts");
const createProjectHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const community = await community_ts_1.CommunityQueries.getCommunityByIdQuery(requestModel?.communityId);
        const existingProject = await project_ts_1.ProjectQueries.getProjectByNameQuery(requestModel?.name);
        const userId = req.userId;
        if ((0, security_ts_1.checkSecurity)((0, createProjectSecurity_ts_1.createProjectSecurity)(res, community, userId, existingProject))) {
            const project = await (0, createProjectMapper_ts_1.createProjectMapper)(requestModel, requestModel.communityId);
            const savedProject = await project_ts_1.ProjectQueries.createProjectQuery(project);
            await community_ts_1.CommunityQueries.addProjectToCommunityQuery(requestModel.communityId, savedProject._id.toString());
            req.project = savedProject;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.createProjectHandler.name);
    }
};
exports.createProjectHandler = createProjectHandler;
