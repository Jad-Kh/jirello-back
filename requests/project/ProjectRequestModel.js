class ProjectRequestModel {
    name = undefined;
    organizerIds = undefined;
    userIds = undefined;
    communityId = undefined;
    taskIds = undefined;
    taskGroupIds = undefined;

    constructor(values) {
        this.name = values.name;
        this.organizerIds = values.organizerIds;
        this.userIds = values.userIds;
        this.communityId = values.communityId;
        this.taskIds = values.taskIds;
        this.taskGroupIds = values.taskGroupIds;
    }
}

export {
    ProjectRequestModel
}