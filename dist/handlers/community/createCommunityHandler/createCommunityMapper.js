"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommunityMapper = void 0;
const createCommunityMapper = async (community, userId) => {
    const ownerIds = [userId];
    const userIds = [];
    const projectIds = [];
    const template = community?.template ?? "Normal";
    const roleIds = [];
    const screenIds = [];
    const validationLevel = 0;
    const requiredValidationLevel = 0;
    return {
        name: community.name,
        flag: community.flag,
        ownerIds,
        userIds,
        projectIds,
        template,
        roleIds,
        screenIds,
        validationLevel,
        requiredValidationLevel
    };
};
exports.createCommunityMapper = createCommunityMapper;
