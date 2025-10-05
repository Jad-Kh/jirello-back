"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleQueries = void 0;
const Role_1 = require("../models/role/Role");
const Community_1 = require("../models/community/Community");
const createRoleQuery = async (body) => {
    return await new Role_1.RoleModel(body).save();
};
const getRoleByIdQuery = async (id) => {
    const role = await Role_1.RoleModel.findOne({
        _id: id,
    });
    return role;
};
const updateRoleQuery = async (id, updates) => {
    return await Role_1.RoleModel.findByIdAndUpdate(id, updates, { new: true });
};
const getRoleByTitleQuery = async (title) => {
    const role = await Role_1.RoleModel.findOne({
        "title": title,
    });
    return role;
};
const addUserToRoleQuery = async (roleId, userId) => {
    return await Role_1.RoleModel.updateOne({ _id: roleId }, { $addToSet: { userIds: userId } });
};
const removeUserFromRoleQuery = async (roleId, userId) => {
    return await Role_1.RoleModel.updateOne({ _id: roleId }, { $pull: { userIds: userId } });
};
const getRolesOfCommunityQuery = async (communityId) => {
    const community = await Community_1.CommunityModel.findById(communityId).select("roleIds");
    const roleIds = community.roleIds;
    const roles = await Role_1.RoleModel.find({
        _id: { $in: roleIds }
    });
    return roles;
};
const getRolesOfCommunityPaginatedQuery = async (communityId, skip, limit) => {
    const community = await Community_1.CommunityModel.findById(communityId).select("roleIds");
    const roleIds = community.roleIds;
    const roles = await Role_1.RoleModel.find({
        _id: { $in: roleIds }
    }).skip(skip)
        .limit(limit);
    return roles;
};
const getRolesOfUserInCommunityQuery = async (communityId, userId) => {
    const roles = await Role_1.RoleModel.find({
        communityId,
        userIds: { $in: [userId] }
    });
    return roles;
};
exports.RoleQueries = {
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
