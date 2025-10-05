"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverySecurity = void 0;
const lodash_1 = require("lodash");
const AuthErrorResponses_ts_1 = require("../../../responses/errors/AuthErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const recoverySecurity = (res, user) => {
    if ((0, lodash_1.isEmpty)(user)) {
        return res.status(AuthErrorResponses_ts_1.AuthErrorResponses.EMAIL_NOT_EXISTS_ERROR.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(AuthErrorResponses_ts_1.AuthErrorResponses.EMAIL_NOT_EXISTS_ERROR, null));
    }
    return true;
};
exports.recoverySecurity = recoverySecurity;
