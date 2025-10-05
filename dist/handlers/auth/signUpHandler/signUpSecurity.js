"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSecurity = void 0;
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const AuthErrorResponses_ts_1 = require("../../../responses/errors/AuthErrorResponses.ts");
const errorResponsePresenter_ts_1 = require("../../../presenters/common/errorResponsePresenter.ts");
const signUpSecurity = (res, userByEmail, userByUsername) => {
    if (!(0, isEmpty_1.default)(userByEmail)) {
        return res.status(AuthErrorResponses_ts_1.AuthErrorResponses.EMAIL_EXISTS_ERROR.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(AuthErrorResponses_ts_1.AuthErrorResponses.EMAIL_EXISTS_ERROR, null));
    }
    if (!(0, isEmpty_1.default)(userByUsername)) {
        return res.status(AuthErrorResponses_ts_1.AuthErrorResponses.USERNAME_EXISTS_ERROR.code)
            .json((0, errorResponsePresenter_ts_1.prepareErrorResponse)(AuthErrorResponses_ts_1.AuthErrorResponses.USERNAME_EXISTS_ERROR, null));
    }
    return true;
};
exports.signUpSecurity = signUpSecurity;
