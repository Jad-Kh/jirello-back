"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.createPermissionsResponse = exports.aggregatePermissions = exports.createMaxRolePermissionResponse = exports.Permissions = exports.permissionTypes = void 0;
const PermissionsResponse_js_1 = require("../models/permissions/PermissionsResponse.js");
const permissionTypes = {
    TASKS: "tasks",
    TASK_GROUPS: "taskGroups",
    MEETINGS: "meetings",
    PROJECTS: "projects",
    SCREENS: "screens",
    ROLES: "roles"
};
exports.permissionTypes = permissionTypes;
const Permissions = {
    READ_OWN: 1,
    CREATE_OWN: 2,
    EDIT_OWN: 3,
    DELETE_OWN: 4,
    CHANGE_OWN: 5,
    READ_OTHER: 6,
    CREATE_OTHER: 7,
    EDIT_OTHER: 8,
    DELETE_OTHER: 9,
    CHANGE_OTHER: 10
};
exports.Permissions = Permissions;
const createMaxRolePermissionResponse = () => {
    const permissions = {
        tasks: new Set([10]),
        taskGroups: new Set([10]),
        meetings: new Set([10]),
        projects: new Set([10]),
        screens: new Set([10]),
        roles: new Set([10])
    };
    return createPermissionsResponse(permissions);
};
exports.createMaxRolePermissionResponse = createMaxRolePermissionResponse;
const aggregatePermissions = (userRoles) => {
    const permissions = {
        tasks: new Set(),
        taskGroups: new Set(),
        meetings: new Set(),
        projects: new Set(),
        screens: new Set(),
        roles: new Set()
    };
    Object.keys(permissions).forEach(key => {
        permissions[key] = new Set(userRoles.flatMap(role => role.permissionOverrides[key] || []));
    });
    return createPermissionsResponse(permissions);
};
exports.aggregatePermissions = aggregatePermissions;
const createPermissionsResponse = (permissionSet) => {
    return new PermissionsResponse_js_1.PermissionsResponse({
        tasks: [...permissionSet.tasks],
        taskGroups: [...permissionSet.taskGroups],
        meetings: [...permissionSet.meetings],
        projects: [...permissionSet.projects],
        screens: [...permissionSet.screens],
        roles: [...permissionSet.roles]
    });
};
exports.createPermissionsResponse = createPermissionsResponse;
const hasPermission = (userPermissions, permissionType, requiredPermissions) => {
    return userPermissions?.[permissionType]?.some(p => requiredPermissions.includes(p));
};
exports.hasPermission = hasPermission;
