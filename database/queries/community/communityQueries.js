import { CommunityModel } from "../../models/community/community.js"
import { UserModel } from "../../models/user/user.js";

const createCommunityQuery = async (body) => {
    return await CommunityModel(body).save();
};

const getCommunityByIdQuery = async (id) => {
    const community = await CommunityModel.findOne({
        _id: id,
    });
    return community;
};

const getCommunityByNameQuery = async (name) => {
    const community = await CommunityModel.findOne({
        name: name,
    });
    return community;
};

const getCommunityByFlagQuery = async (flag) => {
    const community = await CommunityModel.findOne({
        flag: flag,
    });
    return community;
};

const updateCommunityQuery = async (id, updates) => {
    return await CommunityModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );
};

const addUserToCommunityQuery = async (communityId, userId) => {
    return await CommunityModel.updateOne(
        { _id: communityId }, 
        { $addToSet: { userIds: userId } }
    );
};

const removeUserFromCommunityQuery = async (communityId, userId) => {
    return await CommunityModel.updateOne(
        { _id: communityId }, 
        { $pull: { userIds: userId } }
    );
};

const addProjectToCommunityQuery = async (communityId, projectId) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $addToSet: { projectIds: projectId } }
    );
};

const removeProjectFromCommunityQuery = async (communityId, projectId) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $pull: { projectIds: projectId } }
    );
};

const updateCommunityPermissionsQuery = async (id, permissions) => {
    return await CommunityModel.findByIdAndUpdate(
        id,
        { permissions: permissions },
        { new: true }
    );
};

const getCommunitiesOfUserQuery = async (userId) => {
    const user = await UserModel.findById(userId).select("communityIds ownedCommunityIds");
    const communityIds = [...user.communityIds, ...user.ownedCommunityIds];
    const communities = await CommunityModel.find({ 
        _id: { $in: communityIds } 
    });
    return communities;    
};

const getCommunitiesOfUserPaginatedQuery = async (userId, skip, limit) => {
    const user = await UserModel.findById(userId).select("communityIds ownedCommunityIds");
    const communityIds = [...user.communityIds, ...user.ownedCommunityIds];
    const communities = await CommunityModel.find({ 
        _id: { $in: communityIds } 
    })
    .skip(skip)
    .limit(limit);
    return communities;    
};

export {
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
}