"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectResponse = void 0;
const APISignature_ts_1 = require("../api/APISignature.ts");
class ProjectResponse extends APISignature_ts_1.APISignature {
    name;
    organizerIds;
    userIds;
    communityId;
    taskIds;
    taskGroupIds;
    constructor(values) {
        super(values);
        this.name = values.name;
        this.organizerIds = values.organizerIds;
        this.userIds = values.userIds;
        this.communityId = values.communityId;
        this.taskIds = values.taskIds;
        this.taskGroupIds = values.taskGroupIds;
    }
}
exports.ProjectResponse = ProjectResponse;
