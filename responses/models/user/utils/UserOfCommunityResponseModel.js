import { UserProfileResponseModel } from "./UserProfileResponseModel.js";

class UserOfCommunityResponseModel {
    user = undefined;
    role = undefined;

    constructor(values) {
        this.user = new UserProfileResponseModel(values.user);
        this.role = values.role;
    }
}

export {
    UserOfCommunityResponseModel
}