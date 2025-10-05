"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailHandler = void 0;
const user_ts_1 = require("../../../database/queries/user.ts");
const getUserByEmailSecurity_ts_1 = require("./getUserByEmailSecurity.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const getUserByEmailHandler = async (req, res, next) => {
    try {
        const email = req.requestModel?.email;
        const user = await user_ts_1.UserQueries.getUserByEmailQuery(email);
        if ((0, security_ts_1.checkSecurity)((0, getUserByEmailSecurity_ts_1.getUserByEmailSecurity)(res, user))) {
            req.user = user;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getUserByEmailHandler.name);
    }
};
exports.getUserByEmailHandler = getUserByEmailHandler;
