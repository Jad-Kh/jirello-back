"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleSecurity = void 0;
const RoleErrorResponses_ts_1 = require("../../../responses/errors/RoleErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const createRoleSecurity = (res, roleByTitle, communityId) => {
    if (roleByTitle && roleByTitle.communityId === communityId) {
        return res.status(RoleErrorResponses_ts_1.RoleErrorResponses.ROLE_NAME_ALREADY_EXISTS.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(RoleErrorResponses_ts_1.RoleErrorResponses.ROLE_NAME_ALREADY_EXISTS, null));
    }
    return true;
};
exports.createRoleSecurity = createRoleSecurity;
