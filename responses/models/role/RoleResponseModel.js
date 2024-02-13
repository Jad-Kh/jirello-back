import { APISignatureResponseModel } from "../API/APISignatureResponseModel.js";

class RoleResponseModel extends APISignatureResponseModel {
    title = undefined;
    userIds = undefined;
    communityId = undefined;
    permissionOverrides = undefined;
    permittedScreenIds = undefined;
    overrideAll = undefined;
    parentRoleId = undefined;
    priorityPosition = undefined;
    projectBased = undefined;
    projectIds = undefined;

    constructor(values) {
        super(values);
        this.title = values.title;
        this.userIds = values.userIds;
        this.communityId = values?.communityId;
        this.permissionOverrides = values?.permissionOverrides;
        this.permittedScreenIds = values?.permittedScreenIds;
        this.overrideAll = values?.overrideAll;
        this.parentRoleId = values?.parentRoleId;
        this.priorityPosition = values?.priorityPosition;
        this.projectBased = values?.projectBased;
        this.projectIds = values?.projectIds;
    }
};

export {
    RoleResponseModel
}