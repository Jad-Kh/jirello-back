"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoveryHandler = void 0;
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const recoverySecurity_ts_1 = require("./recoverySecurity.ts");
const recoveryHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const user = await user_ts_1.UserQueries.getUserByEmailQuery(requestModel?.email);
        if ((0, security_ts_1.checkSecurity)((0, recoverySecurity_ts_1.recoverySecurity)(res, user))) {
            req.user = user;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.recoveryHandler.name);
    }
};
exports.recoveryHandler = recoveryHandler;
