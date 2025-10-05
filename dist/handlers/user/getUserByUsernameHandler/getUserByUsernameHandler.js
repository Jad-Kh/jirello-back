"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsernameHandler = void 0;
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const getUserByUsernameSecurity_ts_1 = require("./getUserByUsernameSecurity.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const getUserByUsernameHandler = async (req, res, next) => {
    try {
        const username = req.requestModel?.username;
        const user = await user_ts_1.UserQueries.getUserByUsernameQuery(username);
        if ((0, security_ts_1.checkSecurity)((0, getUserByUsernameSecurity_ts_1.getUserByUsernameSecurity)(res, user))) {
            req.user = user;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getUserByUsernameHandler.name);
    }
};
exports.getUserByUsernameHandler = getUserByUsernameHandler;
