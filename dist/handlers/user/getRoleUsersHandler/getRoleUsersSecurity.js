"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleUsersSecurity = void 0;
const lodash_1 = require("lodash");
const RoleErrorResponses_ts_1 = require("../../../responses/errors/RoleErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const getRoleUsersSecurity = (res, role) => {
    if ((0, lodash_1.isEmpty)(role)) {
        return res.status(RoleErrorResponses_ts_1.RoleErrorResponses.ROLE_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(RoleErrorResponses_ts_1.RoleErrorResponses.ROLE_NOT_FOUND, null));
    }
    return true;
};
exports.getRoleUsersSecurity = getRoleUsersSecurity;
