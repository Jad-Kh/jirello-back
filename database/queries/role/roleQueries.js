import { RoleModel } from "../../models/role/role.js";
import { CommunityModel } from "../../models/community/community.js";

const createRoleQuery = async (body) => {
    return await RoleModel(body).save();
};

const getRoleByIdQuery = async (id) => {
    const role = await RoleModel.findOne({
        _id: id,
    });
    return role;
};

const updateRoleQuery = async (id, updates) => {
    return await RoleModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
    );
};

const getRoleByTitleQuery = async (title) => {
    const role = await RoleModel.findOne({
        "title": title,
    });
    return role;
};

const addUserToRoleQuery = async (roleId, userId) => {
    return await RoleModel.updateOne(
        { _id: roleId }, 
        { $addToSet: { userIds: userId } }
    );
};

const removeUserFromRoleQuery = async (roleId, userId) => {
    return await RoleModel.updateOne(
        { _id: roleId }, 
        { $pull: { userIds: userId } }
    );
};

const getRolesOfCommunityQuery = async (communityId) => {
    const community = await CommunityModel.findById(communityId).select("roleIds");
    const roleIds = community.roleIds;
    const roles = await RoleModel.find({ 
        _id: { $in: roleIds } 
    });
    return roles;    
};

const getRolesOfCommunityPaginatedQuery = async (communityId, skip, limit) => {
    const community = await CommunityModel.findById(communityId).select("roleIds");
    const roleIds = community.roleIds;
    const roles = await RoleModel.find({ 
        _id: { $in: roleIds } 
    }).skip(skip)
    .limit(limit);
    return roles;    
};

const getRolesOfUserInCommunityQuery = async (communityId, userId) => {
    const roles = await RoleModel.find({
        communityId,
        userIds: { $in: [userId] } 
    });
    return roles;
};

export {
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