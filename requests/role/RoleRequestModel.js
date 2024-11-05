import { CommunityPermissionsRequestModel } from "../community/utils/CommunityPermissionsRequestModel.js";

class RoleRequestModel {
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
        this.title = values.title;
        this.userIds = values.userIds;
        this.communityId = values.communityId;
        this.permissionOverrides = new CommunityPermissionsRequestModel(values.permissionOverrides);
        this.overrideAll = values.overrideAll;
        this.parentRoleId = values.parentRoleId;
        this.priorityPosition = values.priorityPosition;
        this.projectBased = values.projectBased;
        this.projectIds = values.projectIds;
    }
}

export {
    RoleRequestModel
}