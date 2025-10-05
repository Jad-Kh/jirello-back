"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailSecurity = void 0;
const lodash_1 = require("lodash");
const UserErrorResponses_ts_1 = require("../../../responses/errors/UserErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const getUserByEmailSecurity = (res, user) => {
    if ((0, lodash_1.isEmpty)(user)) {
        return res.status(UserErrorResponses_ts_1.UserErrorResponses.EMAIL_ERROR.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(UserErrorResponses_ts_1.UserErrorResponses.EMAIL_ERROR, null));
    }
    return true;
};
exports.getUserByEmailSecurity = getUserByEmailSecurity;
