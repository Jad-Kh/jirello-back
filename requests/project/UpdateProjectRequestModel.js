class UpdateProjectRequestModel {
    name = undefined;
    organizerIds = undefined;
    userIds = undefined;
    communityId = undefined;

    constructor(values) {
        this.name = values.name;
        this.organizerIds = values.organizerIds;
        this.userIds = values.userIds;
        this.communityId = values.communityId;
    }
}

export {
    UpdateProjectRequestModel
}