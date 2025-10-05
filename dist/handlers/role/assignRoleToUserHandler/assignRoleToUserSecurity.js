"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRoleToUserSecurity = void 0;
const lodash_1 = require("lodash");
const RoleErrorResponses_ts_1 = require("../../../responses/errors/RoleErrorResponses.ts");
const UserErrorResponses_ts_1 = require("../../../responses/errors/UserErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const assignRoleToUserSecurity = (res, role, user, userId) => {
    if ((0, lodash_1.isEmpty)(role)) {
        return res.status(RoleErrorResponses_ts_1.RoleErrorResponses.ROLE_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(RoleErrorResponses_ts_1.RoleErrorResponses.ROLE_NOT_FOUND, null));
    }
    if ((0, lodash_1.isEmpty)(user)) {
        return res.status(UserErrorResponses_ts_1.UserErrorResponses.USER_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(UserErrorResponses_ts_1.UserErrorResponses.USER_NOT_FOUND, null));
    }
    if (role.userIds.includes(userId)) {
        return res.status(RoleErrorResponses_ts_1.RoleErrorResponses.ROLE_USER_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(RoleErrorResponses_ts_1.RoleErrorResponses.ROLE_USER_FOUND, null));
    }
    return true;
};
exports.assignRoleToUserSecurity = assignRoleToUserSecurity;
