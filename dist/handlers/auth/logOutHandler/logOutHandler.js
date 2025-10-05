"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutHandler = void 0;
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const logOutSecurity_ts_1 = require("./logOutSecurity.ts");
const logOutHandler = async (req, res, next) => {
    try {
        const userId = req.requestModel?.id;
        const user = await user_ts_1.UserQueries.getUserByIdQuery(userId);
        if ((0, security_ts_1.checkSecurity)((0, logOutSecurity_ts_1.logOutSecurity)(res, user))) {
            await user_ts_1.UserQueries.removeUserAccessQuery(userId);
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.logOutHandler.name);
    }
};
exports.logOutHandler = logOutHandler;
