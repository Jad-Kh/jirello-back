import { APISignature } from "../api/APISignature.js";
import { PermissionsResponse } from "../permissions/PermissionsResponse.js";

export class RoleResponse extends APISignature {
    title: string;
    userIds: string[];
    communityId: string;
    permissionOverrides?: PermissionsResponse;
    permittedScreenIds: string[];
    overrideAll?: boolean;
    parentRoleId: string;
    priorityPosition: number;
    projectBased: boolean;
    projectIds: string[];

    constructor(values: RoleResponse) {
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
}
