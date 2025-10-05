"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleResponse = void 0;
const APISignature_ts_1 = require("../api/APISignature.ts");
class RoleResponse extends APISignature_ts_1.APISignature {
    title;
    userIds;
    communityId;
    permissionOverrides;
    permittedScreenIds;
    overrideAll;
    parentRoleId;
    priorityPosition;
    projectBased;
    projectIds;
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
}
exports.RoleResponse = RoleResponse;
