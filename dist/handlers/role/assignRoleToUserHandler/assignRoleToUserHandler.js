"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignRoleToUserHandler = void 0;
const role_ts_1 = require("../../../database/queries/role.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const assignRoleToUserSecurity_ts_1 = require("./assignRoleToUserSecurity.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const assignRoleToUserHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const role = await role_ts_1.RoleQueries.getRoleByIdQuery(requestModel.roleId);
        const user = await user_ts_1.UserQueries.getUserByIdQuery(requestModel.userId);
        if ((0, security_ts_1.checkSecurity)((0, assignRoleToUserSecurity_ts_1.assignRoleToUserSecurity)(res, role, user, requestModel.userId))) {
            await role_ts_1.RoleQueries.addUserToRoleQuery(requestModel.roleId, requestModel.userId);
            await user_ts_1.UserQueries.assignRoleToUserQuery(requestModel.userId, requestModel.roleId);
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.assignRoleToUserHandler.name);
    }
};
exports.assignRoleToUserHandler = assignRoleToUserHandler;
