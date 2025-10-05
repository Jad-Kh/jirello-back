import { RoleModel } from "../models/role/Role";
import { CommunityModel } from "../models/community/Community";

const createRoleQuery = async (body) => {
    return await new RoleModel(body).save();
};

const getRoleByIdQuery = async (id: string) => {
    const role = await RoleModel.findOne({
        _id: id,
    });
    return role;
};

const updateRoleQuery = async (id: string, updates) => {
    return await RoleModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );
};

const getRoleByTitleQuery = async (title: string) => {
    const role = await RoleModel.findOne({
        "title": title,
    });
    return role;
};

const addUserToRoleQuery = async (roleId: string, userId: string) => {
    return await RoleModel.updateOne(
        { _id: roleId },
        { $addToSet: { userIds: userId } }
    );
};

const removeUserFromRoleQuery = async (roleId: string, userId: string) => {
    return await RoleModel.updateOne(
        { _id: roleId },
        { $pull: { userIds: userId } }
    );
};

const getRolesOfCommunityQuery = async (communityId: string) => {
    const community = await CommunityModel.findById(communityId).select("roleIds");
    const roleIds = community.roleIds;
    const roles = await RoleModel.find({
        _id: { $in: roleIds }
    });
    return roles;
};

const getRolesOfCommunityPaginatedQuery = async (communityId: string, skip: number, limit: number) => {
    const community = await CommunityModel.findById(communityId).select("roleIds");
    const roleIds = community.roleIds;
    const roles = await RoleModel.find({
        _id: { $in: roleIds }
    }).skip(skip)
        .limit(limit);
    return roles;
};

const getRolesOfUserInCommunityQuery = async (communityId: string, userId: string) => {
    const roles = await RoleModel.find({
        communityId,
        userIds: { $in: [userId] }
    });
    return roles;
};

export const RoleQueries = {
    createRoleQuery,
    getRoleByIdQuery,
    updateRoleQuery,
    getRoleByTitleQuery,
    addUserToRoleQuery,
    removeUserFromRoleQuery,
    getRolesOfCommunityQuery,
    getRolesOfCommunityPaginatedQuery,
    getRolesOfUserInCommunityQuery
};