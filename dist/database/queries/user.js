"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQueries = void 0;
const User_1 = require("../models/user/User");
const Community_1 = require("../models/community/Community");
const createUserQuery = async (body) => {
    return await new User_1.UserModel(body).save();
};
const getUserByIdQuery = async (id) => {
    const user = await User_1.UserModel.findOne({
        _id: id,
    });
    return user;
};
const getUserByEmailQuery = async (email) => {
    const checked_email = email.toLowerCase();
    const user = await User_1.UserModel.findOne({
        "profile.email": checked_email,
    });
    return user;
};
const getUserByUsernameQuery = async (username) => {
    const user = await User_1.UserModel.findOne({
        "profile.username": username,
    });
    return user;
};
const getUsersOfCommunityQuery = async (communityId) => {
    const community = await Community_1.CommunityModel.findById(communityId).select("userIds ownerIds");
    const userIds = [...community.userIds, ...community.ownerIds];
    const users = await User_1.UserModel.find({
        _id: { $in: userIds }
    }).select("profile");
    return users;
};
const getUsersOfCommunityPaginatedQuery = async (communityId, skip, limit) => {
    const community = await Community_1.CommunityModel.findById(communityId).select("userIds ownerIds");
    const userIds = [...community.userIds, ...community.ownerIds];
    const users = await User_1.UserModel.find({
        _id: { $in: userIds }
    }).select("profile")
        .skip(skip)
        .limit(limit);
    return users;
};
const addCommunityToUserQuery = async (userId, communityId) => {
    return await User_1.UserModel.updateOne({ _id: userId }, { $addToSet: { communityIds: communityId } });
};
const addCommunityToUserOwnedQuery = async (userId, communityId) => {
    return await User_1.UserModel.updateOne({ _id: userId }, { $addToSet: { ownedCommunityIds: communityId } });
};
const removeCommunityFromUserQuery = async (userId, communityId) => {
    return await User_1.UserModel.updateOne({ _id: userId }, { $pull: { communityIds: communityId } });
};
const getUsersByRoleIdQuery = async (roleId) => {
    const users = await User_1.UserModel.find({
        "roles.roleIds": roleId,
    }).select("profile");
    return users;
};
const getUsersByRoleIdPaginatedQuery = async (roleId, skip, limit) => {
    const users = await User_1.UserModel.find({
        "roles.roleIds": roleId,
    }).select("profile")
        .skip(skip)
        .limit(limit);
    return users;
};
const assignRoleToUserQuery = async (userId, roleId) => {
    return await User_1.UserModel.updateOne({ _id: userId }, { $addToSet: { roleIds: roleId } });
};
const removeRoleFromUserQuery = async (userId, roleId) => {
    return await User_1.UserModel.updateOne({ _id: userId }, { $pull: { roleIds: roleId } });
};
const getUserAccessByIdQuery = async (id) => {
    const userAccess = await User_1.UserModel.findOne({
        _id: id,
    }).select("access");
    return userAccess;
};
const updateUserAccessQuery = async (id, token) => {
    return await User_1.UserModel.updateOne({ _id: id }, { $set: { 'access.refreshToken': token } });
};
const removeUserAccessQuery = async (id) => {
    return await User_1.UserModel.updateOne({ _id: id }, { $set: { 'access.refreshToken': null } });
};
exports.UserQueries = {
    createUserQuery,
    getUserByIdQuery,
    getUserByEmailQuery,
    getUserByUsernameQuery,
    getUsersOfCommunityQuery,
    getUsersOfCommunityPaginatedQuery,
    addCommunityToUserQuery,
    addCommunityToUserOwnedQuery,
    removeCommunityFromUserQuery,
    getUsersByRoleIdQuery,
    getUsersByRoleIdPaginatedQuery,
    assignRoleToUserQuery,
    removeRoleFromUserQuery,
    getUserAccessByIdQuery,
    updateUserAccessQuery,
    removeUserAccessQuery
};
