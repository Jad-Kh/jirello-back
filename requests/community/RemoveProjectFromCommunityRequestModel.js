class RemoveProjectFromCommunityRequestModel {
    communityId = undefined;
    projectId = undefined;

    constructor(values) {
        this.communityId = values.communityId;
        this.projectId = values.projectId;
    }
}

export {
    RemoveProjectFromCommunityRequestModel
}