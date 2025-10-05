"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityQueries = void 0;
const Community_1 = require("../models/community/Community");
const User_1 = require("../models/user/User");
const createCommunityQuery = async (body) => {
    return await new Community_1.CommunityModel(body).save();
};
const getCommunityByIdQuery = async (id) => {
    const community = await Community_1.CommunityModel.findOne({
        _id: id,
    });
    return community;
};
const getCommunityByNameQuery = async (name) => {
    const community = await Community_1.CommunityModel.findOne({
        name: name,
    });
    return community;
};
const getCommunityByFlagQuery = async (flag) => {
    const community = await Community_1.CommunityModel.findOne({
        flag: flag,
    });
    return community;
};
const updateCommunityQuery = async (id, updates) => {
    return await Community_1.CommunityModel.findByIdAndUpdate(id, updates, { new: true });
};
const addUserToCommunityQuery = async (communityId, userId) => {
    return await Community_1.CommunityModel.updateOne({ _id: communityId }, { $addToSet: { userIds: userId } });
};
const removeUserFromCommunityQuery = async (communityId, userId) => {
    return await Community_1.CommunityModel.updateOne({ _id: communityId }, { $pull: { userIds: userId } });
};
const addProjectToCommunityQuery = async (communityId, projectId) => {
    return await Community_1.CommunityModel.updateOne({ _id: communityId }, { $addToSet: { projectIds: projectId } });
};
const removeProjectFromCommunityQuery = async (communityId, projectId) => {
    return await Community_1.CommunityModel.updateOne({ _id: communityId }, { $pull: { projectIds: projectId } });
};
const updateCommunityPermissionsQuery = async (id, permissions) => {
    return await Community_1.CommunityModel.findByIdAndUpdate(id, { permissions: permissions }, { new: true });
};
const getCommunitiesOfUserQuery = async (userId) => {
    const user = await User_1.UserModel.findById(userId).select("communityIds ownedCommunityIds");
    const communityIds = [...user.communityIds, ...user.ownedCommunityIds];
    const communities = await Community_1.CommunityModel.find({
        _id: { $in: communityIds }
    });
    return communities;
};
const getCommunitiesOfUserPaginatedQuery = async (userId, skip, limit) => {
    const user = await User_1.UserModel.findById(userId).select("communityIds ownedCommunityIds");
    const communityIds = [...user.communityIds, ...user.ownedCommunityIds];
    const communities = await Community_1.CommunityModel.find({
        _id: { $in: communityIds }
    })
        .skip(skip)
        .limit(limit);
    return communities;
};
exports.CommunityQueries = {
    createCommunityQuery,
    getCommunityByIdQuery,
    getCommunityByNameQuery,
    getCommunityByFlagQuery,
    updateCommunityQuery,
    addUserToCommunityQuery,
    removeUserFromCommunityQuery,
    addProjectToCommunityQuery,
    removeProjectFromCommunityQuery,
    updateCommunityPermissionsQuery,
    getCommunitiesOfUserQuery,
    getCommunitiesOfUserPaginatedQuery
};
