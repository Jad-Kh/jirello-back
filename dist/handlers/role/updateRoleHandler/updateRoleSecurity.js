"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleSecurity = void 0;
const lodash_1 = require("lodash");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const RoleErrorResponses_ts_1 = require("../../../responses/errors/RoleErrorResponses.ts");
const ProjectErrorResponses_ts_1 = require("../../../responses/errors/ProjectErrorResponses.ts");
const updateRoleSecurity = (res, role) => {
    if ((0, lodash_1.isEmpty)(role)) {
        return res.status(RoleErrorResponses_ts_1.RoleErrorResponses.ROLE_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(ProjectErrorResponses_ts_1.ProjectErrorResponses.PROJECT_NOT_FOUND, null));
    }
    return true;
};
exports.updateRoleSecurity = updateRoleSecurity;
