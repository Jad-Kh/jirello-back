"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleMapper = void 0;
const createRoleMapper = (role, userId) => {
    const userIds = [userId];
    const projectIds = [];
    const permittedScreenIds = [];
    const overrideAll = false;
    return {
        title: role.title,
        userIds,
        communityId: role.communityId,
        permittedScreenIds,
        overrideAll,
        parentRoleId: role.parentRoleId,
        priorityPosition: role.priorityPosition,
        projectBased: role.projectBased,
        projectIds
    };
};
exports.createRoleMapper = createRoleMapper;
