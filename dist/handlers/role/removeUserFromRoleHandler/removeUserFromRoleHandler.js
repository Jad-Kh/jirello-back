"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromRoleHandler = void 0;
const role_ts_1 = require("../../../database/queries/role.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const removeUserFromRoleSecurity_ts_1 = require("./removeUserFromRoleSecurity.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const removeUserFromRoleHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const role = await role_ts_1.RoleQueries.getRoleByIdQuery(requestModel.roleId);
        const user = await user_ts_1.UserQueries.getUserByIdQuery(requestModel.userId);
        if ((0, security_ts_1.checkSecurity)((0, removeUserFromRoleSecurity_ts_1.removeUserFromRoleSecurity)(res, role, user, requestModel.userId))) {
            await role_ts_1.RoleQueries.removeUserFromRoleQuery(requestModel.roleId, requestModel.userId);
            await user_ts_1.UserQueries.removeRoleFromUserQuery(requestModel.userId, requestModel.roleId);
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.removeUserFromRoleHandler.name);
    }
};
exports.removeUserFromRoleHandler = removeUserFromRoleHandler;
