import { UserModel } from "../models/user/User";
import { CommunityModel } from "../models/community/Community"
import { IUser } from "../models/user/IUser.ts";

const createUserQuery = async (body: IUser) => {
    return await new UserModel(body).save();
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
    const userIds = [...community.userIds, ...community.ownerIds];
    const users = await UserModel.find({
        _id: { $in: userIds }
    }).select("profile");
    return users;
};

const getUsersOfCommunityPaginatedQuery = async (communityId: string, skip: number, limit: number) => {
    const community = await CommunityModel.findById(communityId).select("userIds ownerIds");
    const userIds = [...community.userIds, ...community.ownerIds];
    const users = await UserModel.find({
        _id: { $in: userIds }
    }).select("profile")
        .skip(skip)
        .limit(limit);
    return users;
};

const addCommunityToUserQuery = async (userId: string, communityId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { communityIds: communityId } }
    )
};

const addCommunityToUserOwnedQuery = async (userId: string, communityId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { ownedCommunityIds: communityId } }
    )
};

const removeCommunityFromUserQuery = async (userId: string, communityId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $pull: { communityIds: communityId } }
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
    }).select("profile")
        .skip(skip)
        .limit(limit);
    return users;
};

const assignRoleToUserQuery = async (userId: string, roleId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $addToSet: { roleIds: roleId } }
    )
};

const removeRoleFromUserQuery = async (userId: string, roleId: string) => {
    return await UserModel.updateOne(
        { _id: userId },
        { $pull: { roleIds: roleId } }
    );
};

const getUserAccessByIdQuery = async (id: string) => {
    const userAccess = await UserModel.findOne({
        _id: id,
    }).select("access");
    return userAccess;
};

const updateUserAccessQuery = async(id: string, token: string) => {
    return await UserModel.updateOne(
        { _id: id },
        { $set: { 'access.refreshToken': token } }
    );
};

const removeUserAccessQuery = async(id: string) => {
    return await UserModel.updateOne(
        { _id: id },
        { $set: { 'access.refreshToken': null } }
    );
};

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
    removeUserAccessQuery
}