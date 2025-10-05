import { CommunityModel } from "../models/community/Community"
import { UserModel } from "../models/user/User";

import { ICommunity } from "../models/community/ICommunity.ts";

const createCommunityQuery = async (body: ICommunity) => {
    return await new CommunityModel(body).save();
};

const getCommunityByIdQuery = async (id: string): Promise<> => {
    const community = await CommunityModel.findOne({
        _id: id,
    });
    return community;
};

const getCommunityByNameQuery = async (name: string) => {
    const community = await CommunityModel.findOne({
        name: name,
    });
    return community;
};

const getCommunityByFlagQuery = async (flag: string) => {
    const community = await CommunityModel.findOne({
        flag: flag,
    });
    return community;
};

const updateCommunityQuery = async (id: string, updates) => {
    return await CommunityModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );
};

const addUserToCommunityQuery = async (communityId: string, userId: string) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $addToSet: { userIds: userId } }
    );
};

const removeUserFromCommunityQuery = async (communityId: string, userId: string) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $pull: { userIds: userId } }
    );
};

const addProjectToCommunityQuery = async (communityId: string, projectId: string) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $addToSet: { projectIds: projectId } }
    );
};

const removeProjectFromCommunityQuery = async (communityId: string, projectId: string) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $pull: { projectIds: projectId } }
    );
};

const updateCommunityPermissionsQuery = async (id: string, permissions: any) => {
    return await CommunityModel.findByIdAndUpdate(
        id,
        { permissions: permissions },
        { new: true }
    );
};

const getCommunitiesOfUserQuery = async (userId: string) => {
    const user = await UserModel.findById(userId).select("communityIds ownedCommunityIds");
    const communityIds = [...user.communityIds, ...user.ownedCommunityIds];
    const communities = await CommunityModel.find({
        _id: { $in: communityIds }
    });
    return communities;
};

const getCommunitiesOfUserPaginatedQuery = async (userId: string, skip: number, limit: number) => {
    const user = await UserModel.findById(userId).select("communityIds ownedCommunityIds");
    const communityIds = [...user.communityIds, ...user.ownedCommunityIds];
    const communities = await CommunityModel.find({
        _id: { $in: communityIds }
    })
        .skip(skip)
        .limit(limit);
    return communities;
};

export const CommunityQueries = {
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