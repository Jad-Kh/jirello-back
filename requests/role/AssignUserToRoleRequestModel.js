class AssignUserToRoleRequestModel {
    roleId = undefined;
    userId = undefined;

    constructor(values) {
        this.roleId = values.roleId;
        this.userId = values.userId;
    }
}

export {
    AssignUserToRoleRequestModel
}