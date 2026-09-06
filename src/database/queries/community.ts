import { UpdateQuery } from "mongoose";
import { CommunityModel } from "../models/community/Community.js";
import { ICommunity } from "../models/community/ICommunity.js";
import { ICommunityPermissions } from "../models/community/ICommunityPermissions.js";
import { UserModel } from "../models/user/User.js";
import { getTransactionSession } from "../transaction.js";

const createCommunityQuery = async (body: ICommunity) => {
    return await new CommunityModel(body).save({ session: getTransactionSession() });
};

const getCommunityByIdQuery = async (id: string) => CommunityModel.findById(id);

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

const updateCommunityQuery = async (id: string, updates: UpdateQuery<ICommunity>) => {
    return await CommunityModel.findByIdAndUpdate(id, updates, {
        new: true,
        session: getTransactionSession(),
    });
};

const addUserToCommunityQuery = async (communityId: string, userId: string) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $addToSet: { userIds: userId } },
        { session: getTransactionSession() },
    );
};

const removeUserFromCommunityQuery = async (communityId: string, userId: string) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $pull: { userIds: userId } },
        { session: getTransactionSession() },
    );
};

const addProjectToCommunityQuery = async (communityId: string, projectId: string) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $addToSet: { projectIds: projectId } },
        { session: getTransactionSession() },
    );
};

const removeProjectFromCommunityQuery = async (communityId: string, projectId: string) => {
    return await CommunityModel.updateOne(
        { _id: communityId },
        { $pull: { projectIds: projectId } },
        { session: getTransactionSession() },
    );
};

const addRoleToCommunityQuery = async (communityId: string, roleId: string) =>
    CommunityModel.updateOne(
        { _id: communityId },
        { $addToSet: { roleIds: roleId } },
        { session: getTransactionSession() },
    );

const removeRoleFromCommunityQuery = async (communityId: string, roleId: string) =>
    CommunityModel.updateOne(
        { _id: communityId },
        { $pull: { roleIds: roleId } },
        { session: getTransactionSession() },
    );

const updateCommunityPermissionsQuery = async (id: string, permissions: ICommunityPermissions) => {
    return await CommunityModel.findByIdAndUpdate(
        id,
        { permissions: permissions },
        { new: true, session: getTransactionSession() },
    );
};

const getCommunitiesOfUserQuery = async (userId: string) => {
    const user = await UserModel.findById(userId).select("communityIds ownedCommunityIds");
    if (!user) return [];
    const communityIds = [...user.communityIds, ...user.ownedCommunityIds];
    const communities = await CommunityModel.find({
        _id: { $in: communityIds },
    });
    return communities;
};

const getCommunitiesOfUserPaginatedQuery = async (userId: string, skip: number, limit: number) => {
    const user = await UserModel.findById(userId).select("communityIds ownedCommunityIds");
    if (!user) return [];
    const communityIds = [...user.communityIds, ...user.ownedCommunityIds];
    const communities = await CommunityModel.find({
        _id: { $in: communityIds },
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
    addRoleToCommunityQuery,
    removeRoleFromCommunityQuery,
    updateCommunityPermissionsQuery,
    getCommunitiesOfUserQuery,
    getCommunitiesOfUserPaginatedQuery,
};
