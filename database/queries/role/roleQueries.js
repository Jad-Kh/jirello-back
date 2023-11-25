import { RoleModel } from "../../models/role/role.js"

const createRoleQuery = async (body) => {
    return await RoleModel(body).save();
};

const getRoleByIdQuery = async (id) => {
    const role = await RoleModel.findOne({
        _id: id,
    });
    return role;
};

const addUserToRoleQuery = async (roleId, userId) => {
    return await RoleModel.updateOne(
        { _id: roleId }, 
        { $addToSet: { userIds: userId } }
    );
};

export {
    createRoleQuery,
    getRoleByIdQuery,
    addUserToRoleQuery
}