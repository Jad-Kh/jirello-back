import { APISignature } from "../api/APISignature.ts";

export class ProjectResponse extends APISignature {
    name: string;
    organizerIds: string[];
    userIds: string[];
    communityId: string;
    taskIds: string[];
    taskGroupIds: string[];

    constructor(values: ProjectResponse) {
        super(values);
        this.name = values.name;
        this.organizerIds = values.organizerIds;
        this.userIds = values.userIds;
        this.communityId = values.communityId;
        this.taskIds = values.taskIds;
        this.taskGroupIds = values.taskGroupIds;
    }
}