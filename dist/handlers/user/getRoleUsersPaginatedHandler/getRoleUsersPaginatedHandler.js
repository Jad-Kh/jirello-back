"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleUsersHandler = void 0;
const role_ts_1 = require("../../../database/queries/role.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const getRoleUsersPaginatedSecurity_ts_1 = require("./getRoleUsersPaginatedSecurity.ts");
const user_ts_1 = require("../../../database/queries/user.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const pagination_ts_1 = require("../../../helpers/pagination.ts");
const getRoleUsersHandler = async (req, res, next) => {
    try {
        const roleId = req.requestModel?.id;
        const role = await role_ts_1.RoleQueries.getRoleByIdQuery(roleId);
        if ((0, security_ts_1.checkSecurity)((0, getRoleUsersPaginatedSecurity_ts_1.getRoleUsersPaginatedSecurity)(res, role))) {
            const { skip, limit } = (0, pagination_ts_1.preparePagination)(req.query);
            const roleUsers = await user_ts_1.UserQueries.getUsersByRoleIdPaginatedQuery(roleId, skip, limit);
            req.users = roleUsers;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.getRoleUsersHandler.name);
    }
};
exports.getRoleUsersHandler = getRoleUsersHandler;
