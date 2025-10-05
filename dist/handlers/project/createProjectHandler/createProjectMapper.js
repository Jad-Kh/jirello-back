"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectMapper = void 0;
const createProjectMapper = async (project, userId) => {
    const name = project.name;
    const organizerIds = [userId];
    const userIds = [];
    const communityId = project.communityId;
    const taskIds = [];
    const taskGroupIds = [];
    return {
        name,
        organizerIds,
        userIds,
        communityId,
        taskIds,
        taskGroupIds
    };
};
exports.createProjectMapper = createProjectMapper;
