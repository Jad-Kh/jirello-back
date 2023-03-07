class AddUserToCommunityRequestModel {
    communityId = undefined;
    userId = undefined;

    constructor(values) {
        this.communityId = values.communityId;
        this.userId = values.userId;
    }
}

export {
    AddUserToCommunityRequestModel
}