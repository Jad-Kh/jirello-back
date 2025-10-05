"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsernameSecurity = void 0;
const lodash_1 = require("lodash");
const UserErrorResponses_ts_1 = require("../../../responses/errors/UserErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const getUserByUsernameSecurity = (res, user) => {
    if ((0, lodash_1.isEmpty)(user)) {
        return res.status(UserErrorResponses_ts_1.UserErrorResponses.USERNAME_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(UserErrorResponses_ts_1.UserErrorResponses.USERNAME_NOT_FOUND, null));
    }
    return true;
};
exports.getUserByUsernameSecurity = getUserByUsernameSecurity;
