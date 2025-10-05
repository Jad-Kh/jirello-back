"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUsernameOrEmailSecurity = exports.authSecurity = void 0;
const jwtkit_ts_1 = require("../helpers/jwtkit.ts");
const logIn_ts_1 = require("../helpers/logIn.ts");
const errorLogging_ts_1 = require("../helpers/errorLogging.ts");
const CommonErrorResponses_ts_1 = require("../responses/errors/CommonErrorResponses.ts");
const authSecurity = async (req, res, next) => {
    try {
        const user = req.user;
        const registeredToken = jwtkit_ts_1.JWTkit.generateJWTWithExpiration(user);
        res.cookie("token", registeredToken);
        req.userId = user._id;
        req.requestModel.token = registeredToken;
        return next();
    }
    catch (error) {
        return (0, errorLogging_ts_1.handleError)(res, CommonErrorResponses_ts_1.CommonErrorResponses.SERVER_ERROR, error, exports.authSecurity, true);
    }
};
exports.authSecurity = authSecurity;
const parseUsernameOrEmailSecurity = async (req, res, next) => {
    try {
        const data = (0, logIn_ts_1.parseUsernameOrEmail)(req.body);
        req.body = data;
        return next();
    }
    catch (error) {
        return (0, errorLogging_ts_1.handleError)(res, CommonErrorResponses_ts_1.CommonErrorResponses.SERVER_ERROR, error, exports.parseUsernameOrEmailSecurity, true);
    }
};
exports.parseUsernameOrEmailSecurity = parseUsernameOrEmailSecurity;
