"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectHandler = void 0;
const project_ts_1 = require("../../../database/queries/project.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const updateProjectSecurity_ts_1 = require("./updateProjectSecurity.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const updateProjectHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const project = await project_ts_1.ProjectQueries.getProjectByIdQuery(requestModel?.id);
        if ((0, security_ts_1.checkSecurity)((0, updateProjectSecurity_ts_1.updateProjectSecurity)(res, project, req.userId))) {
            const { id, ...updateModel } = requestModel;
            const updatedProject = await project_ts_1.ProjectQueries.updateProjectQuery(id, updateModel);
            req.project = updatedProject;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.updateProjectHandler.name);
    }
};
exports.updateProjectHandler = updateProjectHandler;
