"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenHandler = void 0;
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const refreshTokenSecurity_ts_1 = require("./refreshTokenSecurity.ts");
const jwtkit_ts_1 = require("../../../helpers/jwtkit.ts");
const refreshTokenHandler = async (req, res, next) => {
    try {
        const userId = req.requestModel?.id;
        const access = await user_ts_1.UserQueries.getUserAccessByIdQuery(userId);
        if ((0, security_ts_1.checkSecurity)((0, refreshTokenSecurity_ts_1.refreshTokenSecurity)(res, access))) {
            req.token = jwtkit_ts_1.JWTkit.generateJWTWithExpiration({ id: userId });
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.refreshTokenHandler.name);
    }
};
exports.refreshTokenHandler = refreshTokenHandler;
