import { CommunityModel } from "../../models/community/community.js"

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
        {_id: communityId}, 
        { $pull: { userIds: userId } }
    );
};

const demoteOwnerInCommunityQuery = async (community, userId) => {
    community.ownerIds = community.ownerIds.filter(id => id !== userId);
    community.userIds.push(userId);
    const updatedCommunity = await community.save();
    return updatedCommunity;
};

const promoteUserInCommunityQuery = async (communityId, userId) => {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
        communityId,
        {
          $pull: { userIds: userId },
          $addToSet: { ownerIds: userId },
        },
        { new: true },
    );
    return updatedCommunity;
};

const addProjectToCommunityQuery = async (communityId, projectId) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $addToSet: { projectIds: projectId } }
    );
};

export {
    createCommunityQuery,
    getCommunityByIdQuery,
    getCommunityByNameQuery,
    getCommunityByFlagQuery,
    updateCommunityQuery,
    addUserToCommunityQuery,
    removeUserFromCommunityQuery,
    demoteOwnerInCommunityQuery,
    promoteUserInCommunityQuery,
    addProjectToCommunityQuery
}