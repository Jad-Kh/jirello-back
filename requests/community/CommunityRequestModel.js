import { CommunityPermissionsRequestModel } from "./utils/CommunityPermissionsRequestModel.js";

class CommunityRequestModel {
    name = undefined;
    flag = undefined;
    ownerIds = undefined;
    userIds = undefined;
    projectIds = undefined;
    template = undefined;
    roleIds = undefined;
    screenIds = undefined;
    validationLevel = undefined;
    requiredValidationLevel = undefined;
    permissions = undefined;

    constructor(values) {
        this.name = values.name;
        this.flag = values.flag;
        this.ownerIds = values.ownerIds;
        this.userIds = values.userIds;
        this.projectIds = values.projectIds;
        this.template = values.template;
        this.roleIds = values.roleIds;
        this.screenIds = values.screenIds;
        this.validationLevel = values.validationLevel;
        this.requiredValidationLevel = values.requiredValidationLevel;
        this.permissions = new CommunityPermissionsRequestModel(values.permissions);
    }
}

export {
    CommunityRequestModel
}