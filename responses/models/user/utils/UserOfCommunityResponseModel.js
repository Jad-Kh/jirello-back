import { UserProfileResponseModel } from "./UserProfileResponseModel.js";

class UserOfCommunityResponseModel {
    profile = undefined;
    role = undefined;

    constructor(values) {
        this.profile = new UserProfileResponseModel(values.user.profile);
        this.role = values.role;
    }
}

export {
    UserOfCommunityResponseModel
}