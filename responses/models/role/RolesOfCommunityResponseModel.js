import { RoleResponseModel } from "./RoleResponseModel.js";

class RolesOfCommunityResponseModel {
    roles = [];

    constructor(values) {
        this.roles = values?.map(role =>  new RoleResponseModel(role));
    }
}

export {
    RolesOfCommunityResponseModel
}