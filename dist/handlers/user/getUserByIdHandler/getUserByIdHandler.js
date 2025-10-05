"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByIdHandler = void 0;
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const getUserByIdSecurity_ts_1 = require("./getUserByIdSecurity.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const getUserByIdHandler = async (req, res, next) => {
    try {
        const userId = req.requestModel?.id;
        const user = await user_ts_1.UserQueries.getUserByIdQuery(userId);
        if ((0, security_ts_1.checkSecurity)((0, getUserByIdSecurity_ts_1.getUserByIdSecurity)(res, user))) {
            req.user = user;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getUserByIdHandler.name);
    }
};
exports.getUserByIdHandler = getUserByIdHandler;
