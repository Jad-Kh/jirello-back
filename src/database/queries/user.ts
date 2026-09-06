import type { QueryFilter } from "mongoose";
import { CommunityModel } from "../models/community/Community.js";
import { IUser } from "../models/user/IUser.js";
import { UserModel } from "../models/user/User.js";
import { getTransactionSession } from "../transaction.js";

const createUserQuery = async (body: IUser) => {
    return await new UserModel(body).save({ session: getTransactionSession() });
};

const getUserByIdQuery = async (id: string) => {
    const user = await UserModel.findOne({
        _id: id,
    });
    return user;
};

const getUserByEmailQuery = async (email: string) => {
    const checked_email = email.toLowerCase();
    const user = await UserModel.findOne({
        "profile.email": checked_email,
    });
    return user;
};

const getUserByUsernameQuery = async (username: string) => {
    const user = await UserModel.findOne({
        "profile.username": username,
    });
    return user;
};

const getUsersOfCommunityQuery = async (communityId: string) => {
    const community = await CommunityModel.findById(communityId).select("userIds ownerIds");
    if (!community) return [];
    const userIds = [...community.userIds, ...community.ownerIds];
    const users = await UserModel.find({
        _id: { $in: userIds },
    }).select("profile");
    return users;
};

const getUsersOfCommunityPaginatedQuery = async (communityId: string, skip: number, limit: number) => {
    const community = await CommunityModel.findById(communityId).select("userIds ownerIds");
    if (!community) return [];
    const userIds = [...community.userIds, ...community.ownerIds];
    const users = await UserModel.find({
        _id: { $in: userIds },
    })
        .select("profile")
        .skip(skip)
        .limit(limit);
    return users;
};

const addCommunityToUserQuery = async (userId: string, communityId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { communityIds: communityId } },
        { session: getTransactionSession() },
    );
};

const addCommunityToUserOwnedQuery = async (userId: string, communityId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { ownedCommunityIds: communityId } },
        { session: getTransactionSession() },
    );
};

const removeCommunityFromUserQuery = async (userId: string, communityId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $pull: { communityIds: communityId } },
        { session: getTransactionSession() },
    );
};

const getUsersByRoleIdQuery = async (roleId: string) => {
    const users = await UserModel.find({
        "roles.roleIds": roleId,
    }).select("profile");
    return users;
};

const getUsersByRoleIdPaginatedQuery = async (roleId: string, skip: number, limit: number) => {
    const users = await UserModel.find({
        "roles.roleIds": roleId,
    })
        .select("profile")
        .skip(skip)
        .limit(limit);
    return users;
};

const assignRoleToUserQuery = async (userId: string, roleId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { "roles.roleIds": roleId } },
        { session: getTransactionSession() },
    );
};

const removeRoleFromUserQuery = async (userId: string, roleId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $pull: { "roles.roleIds": roleId } },
        { session: getTransactionSession() },
    );
};

const getUserAccessByIdQuery = async (id: string) => {
    const userAccess = await UserModel.findOne({
        _id: id,
    }).select("access");
    return userAccess;
};

const updateUserAccessQuery = async (id: string, token: string) => {
    return await UserModel.updateOne({ _id: id }, { $set: { "access.refreshToken": token } });
};

const removeUserAccessQuery = async (id: string) => {
    return await UserModel.updateOne({ _id: id }, { $set: { "access.refreshToken": "" } });
};

const setPasswordResetTokenQuery = async (id: string, tokenHash: string, expiresAt: Date) =>
    UserModel.updateOne(
        { _id: id },
        {
            $set: {
                "access.passwordResetToken": tokenHash,
                "access.passwordResetExpiresAt": expiresAt,
            },
        },
    );

const resetPasswordQuery = async (tokenHash: string, passwordHash: string, now: Date) =>
    UserModel.findOneAndUpdate(
        {
            "access.passwordResetToken": tokenHash,
            "access.passwordResetExpiresAt": { $gt: now },
        },
        {
            $set: { "profile.password": passwordHash, "access.refreshToken": "" },
            $unset: { "access.passwordResetToken": 1, "access.passwordResetExpiresAt": 1 },
        },
        { new: true },
    );

const updateNotificationPreferencesQuery = async (
    userId: string,
    preferences: { muteAll?: boolean; mutedCommunityIds?: string[]; mutedChatIds?: string[] },
) =>
    UserModel.findByIdAndUpdate(
        userId,
        {
            $set: Object.fromEntries(
                Object.entries(preferences).map(([key, value]) => [`notifications.${key}`, value]),
            ),
        },
        { new: true, session: getTransactionSession() },
    );

const countUsersQuery = (filter: QueryFilter<IUser>) => UserModel.countDocuments(filter);

export const UserQueries = {
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
    removeUserAccessQuery,
    setPasswordResetTokenQuery,
    resetPasswordQuery,
    updateNotificationPreferencesQuery,
    countUsersQuery,
};
