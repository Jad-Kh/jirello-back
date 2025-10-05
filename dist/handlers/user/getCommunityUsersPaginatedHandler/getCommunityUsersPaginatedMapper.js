"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityUsersPaginatedMapper = void 0;
const getCommunityUsersPaginatedMapper = async (community, communityUsers) => {
    return communityUsers.map((user) => {
        const role = community.ownerIds.includes(user.id) ? "owner" : "user";
        return {
            user: user,
            role
        };
    });
};
exports.getCommunityUsersPaginatedMapper = getCommunityUsersPaginatedMapper;
