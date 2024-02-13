import { NestedRoleResponseModel } from "./NestedRoleResponseModel.js";

class RoleHierarchyResponseModel  {
    nestedRoles = [];

    constructor(values) {
        this.nestedRoles = values?.map(role =>  new NestedRoleResponseModel(role));
    }
}

export {
    RoleHierarchyResponseModel
}