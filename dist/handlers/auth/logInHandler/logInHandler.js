"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInHandler = void 0;
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const logInSecurity_ts_1 = require("./logInSecurity.ts");
const jwtkit_ts_1 = require("../../../helpers/jwtkit.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const logInHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const userByUsername = (requestModel?.username && await user_ts_1.UserQueries.getUserByUsernameQuery(requestModel?.username));
        const userByEmail = (requestModel?.email && await user_ts_1.UserQueries.getUserByEmailQuery(requestModel?.email));
        const user = userByUsername || userByEmail;
        if ((0, security_ts_1.checkSecurity)(await (0, logInSecurity_ts_1.logInSecurity)(res, user, requestModel.password, requestModel.username))) {
            const refreshToken = jwtkit_ts_1.JWTkit.generateJWT(user);
            await user_ts_1.UserQueries.updateUserAccessQuery(user.id, refreshToken);
            const accessToken = jwtkit_ts_1.JWTkit.generateJWTWithExpiration(user);
            req.user = { user, refreshToken, accessToken };
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.logInHandler.name);
    }
};
exports.logInHandler = logInHandler;
