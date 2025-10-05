"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleHandler = void 0;
const role_ts_1 = require("../../../database/queries/role.ts");
const security_ts_1 = require("../../../helpers/security.ts");
const createRoleSecurity_ts_1 = require("./createRoleSecurity.ts");
const createRoleMapper_ts_1 = require("./createRoleMapper.ts");
const RoleResponse_ts_1 = require("../../../models/role/RoleResponse.ts");
const errorLogging_ts_1 = require("../../../helpers/errorLogging.ts");
const createRoleHandler = async (req, res, next) => {
    try {
        const requestModel = req.requestModel;
        const roleByTitle = await role_ts_1.RoleQueries.getRoleByTitleQuery(requestModel?.title);
        if ((0, security_ts_1.checkSecurity)((0, createRoleSecurity_ts_1.createRoleSecurity)(res, roleByTitle, requestModel?.communityId))) {
            const mappedRole = (0, createRoleMapper_ts_1.createRoleMapper)(requestModel, req.userId);
            const newRole = new RoleResponse_ts_1.RoleResponse(mappedRole);
            const savedRole = await role_ts_1.RoleQueries.createRoleQuery(newRole);
            req.role = savedRole;
            return next();
        }
    }
    catch (error) {
        (0, errorLogging_ts_1.catchError)(error, res, exports.createRoleHandler.name);
    }
};
exports.createRoleHandler = createRoleHandler;
