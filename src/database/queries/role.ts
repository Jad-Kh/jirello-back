import { UpdateQuery } from "mongoose";
import { CommunityModel } from "../models/community/Community.js";
import { IRole } from "../models/role/IRole.js";
import { RoleModel } from "../models/role/Role.js";
import { getTransactionSession } from "../transaction.js";

const createRoleQuery = async (body: IRole) => {
    return await new RoleModel(body).save({ session: getTransactionSession() });
};

const getRoleByIdQuery = async (id: string) => {
    const role = await RoleModel.findOne({
        _id: id,
    });
    return role;
};

const updateRoleQuery = async (id: string, updates: UpdateQuery<IRole>) => {
    return await RoleModel.findByIdAndUpdate(id, updates, { new: true, session: getTransactionSession() });
};

const getRoleByTitleQuery = async (title: string, communityId?: string) => {
    const role = await RoleModel.findOne({
        title: title,
        ...(communityId ? { communityId } : {}),
    });
    return role;
};

const addUserToRoleQuery = async (roleId: string, userId: string) => {
    return await RoleModel.updateOne(
        { _id: roleId },
        { $addToSet: { userIds: userId } },
        { session: getTransactionSession() },
    );
};

const removeUserFromRoleQuery = async (roleId: string, userId: string) => {
    return await RoleModel.updateOne(
        { _id: roleId },
        { $pull: { userIds: userId } },
        { session: getTransactionSession() },
    );
};

const getRolesOfCommunityQuery = async (communityId: string) => {
    const community = await CommunityModel.findById(communityId).select("roleIds");
    if (!community) return [];
    const roleIds = community.roleIds;
    const roles = await RoleModel.find({
        _id: { $in: roleIds },
    });
    return roles;
};

const getRolesOfCommunityPaginatedQuery = async (communityId: string, skip: number, limit: number) => {
    const community = await CommunityModel.findById(communityId).select("roleIds");
    if (!community) return [];
    const roleIds = community.roleIds;
    const roles = await RoleModel.find({
        _id: { $in: roleIds },
    })
        .skip(skip)
        .limit(limit);
    return roles;
};

const getRolesOfUserInCommunityQuery = async (communityId: string, userId: string) => {
    const roles = await RoleModel.find({
        communityId,
        userIds: { $in: [userId] },
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
    getRolesOfUserInCommunityQuery,
};
