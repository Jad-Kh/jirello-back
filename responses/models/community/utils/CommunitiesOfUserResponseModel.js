import { CommunityResponseModel } from "../CommunityResponseModel.js";

class CommunitiesOfUserResponseModel {
    communities = [];

    constructor(values) {
        this.communities = values?.map(community => new CommunityResponseModel(community));
    }
}

export {
    CommunitiesOfUserResponseModel
}