import { CommunityPermissionsRequestModel } from "./utils/CommunityPermissionsRequestModel.js";

class UpdateCommunityRequestModel {
    name = undefined;
    ownerIds = undefined;
    userIds = undefined;
    projectIds = undefined;
    template = undefined;
    permissions = undefined;

    constructor(values) {
        this.name = values.name;
        this.ownerIds = values.ownerIds;
        this.userIds = values.userIds;
        this.projectIds = values.projectIds;
        this.template = values.template;
        this.permissions = new CommunityPermissionsRequestModel(values.permissions);
    }
}

export {
    UpdateCommunityRequestModel
}