"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSecurity = void 0;
const lodash_1 = require("lodash");
const ProjectErrorResponses_ts_1 = require("../../../responses/errors/ProjectErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const CommonErrorResponses_ts_1 = require("../../../responses/errors/CommonErrorResponses.ts");
const updateProjectSecurity = (res, project, userId) => {
    if ((0, lodash_1.isEmpty)(project)) {
        return res.status(ProjectErrorResponses_ts_1.ProjectErrorResponses.PROJECT_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(ProjectErrorResponses_ts_1.ProjectErrorResponses.PROJECT_NOT_FOUND, null));
    }
    if (!project.organizerIds.includes(userId)) {
        return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, null));
    }
    return true;
};
exports.updateProjectSecurity = updateProjectSecurity;
