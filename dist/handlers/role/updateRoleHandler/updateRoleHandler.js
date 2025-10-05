"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleHandler = void 0;
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const role_ts_1 = require("../../../database/queries/role.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const updateRoleSecurity_ts_1 = require("./updateRoleSecurity.ts");
const updateRoleHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const role = await role_ts_1.RoleQueries.getRoleByIdQuery(requestModel?.id);
        if ((0, security_ts_1.checkSecurity)((0, updateRoleSecurity_ts_1.updateRoleSecurity)(res, role))) {
            const { id, ...updateModel } = requestModel;
            const updatedRole = await role_ts_1.RoleQueries.updateRoleQuery(id, updateModel);
            req.role = updatedRole;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.updateRoleHandler.name);
    }
};
exports.updateRoleHandler = updateRoleHandler;
