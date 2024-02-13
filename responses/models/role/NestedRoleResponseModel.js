import { RoleResponseModel } from "./RoleResponseModel.js";

class NestedRoleResponseModel extends RoleResponseModel {
    childRoles = [];

    constructor(values) {
        super(values);
        this.childRoles = values?.childRoles;
    }
}

export {
    NestedRoleResponseModel
}