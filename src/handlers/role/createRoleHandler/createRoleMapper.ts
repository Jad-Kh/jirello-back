import { RoleRequest } from "./createRoleRequest.js";
import { RoleResponse } from "../../../models/role/RoleResponse.js";

export const createRoleMapper = (role: RoleRequest, userId: string): RoleResponse => {
    const userIds: string[] = [userId];
    const projectIds: string[] = [];
    const permittedScreenIds: string[] = [];
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
