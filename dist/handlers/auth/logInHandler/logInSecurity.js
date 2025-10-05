"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInSecurity = void 0;
const lodash_1 = require("lodash");
const AuthErrorResponses_ts_1 = require("../../../responses/errors/AuthErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserErrorResponses_ts_1 = require("../../../responses/errors/UserErrorResponses.ts");
const logInSecurity = async (res, user, userPassword, username) => {
    const userError = username ? AuthErrorResponses_ts_1.AuthErrorResponses.LOGIN_USERNAME_ERROR : AuthErrorResponses_ts_1.AuthErrorResponses.LOGIN_EMAIL_ERROR;
    if ((0, lodash_1.isEmpty)(user)) {
        return res.status(userError.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(userError, null));
    }
    if (!userPassword) {
        return res.status(AuthErrorResponses_ts_1.AuthErrorResponses.LOGIN_VALIDATION_ERROR.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(AuthErrorResponses_ts_1.AuthErrorResponses.LOGIN_VALIDATION_ERROR, null));
    }
    const passwordValidation = await bcrypt_1.default.compare(userPassword, user.profile.password);
    if (!passwordValidation) {
        return res.status(AuthErrorResponses_ts_1.AuthErrorResponses.LOGIN_VALIDATION_ERROR.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(AuthErrorResponses_ts_1.AuthErrorResponses.LOGIN_VALIDATION_ERROR, null));
    }
    if ((0, lodash_1.isEmpty)(user.id)) {
        return res.status(UserErrorResponses_ts_1.UserErrorResponses.USER_NOT_FOUND.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(UserErrorResponses_ts_1.UserErrorResponses.USER_NOT_FOUND, null));
    }
    return true;
};
exports.logInSecurity = logInSecurity;
