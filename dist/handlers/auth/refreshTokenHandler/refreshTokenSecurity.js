"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSecurity = void 0;
const lodash_1 = require("lodash");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const CommonErrorResponses_ts_1 = require("../../../responses/errors/CommonErrorResponses.ts");
const refreshTokenSecurity = (res, user) => {
    if ((0, lodash_1.isEmpty)(user) || user?.access?.refreshToken === '') {
        return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.UNAUTHORIZED, null));
    }
    return true;
};
exports.refreshTokenSecurity = refreshTokenSecurity;
