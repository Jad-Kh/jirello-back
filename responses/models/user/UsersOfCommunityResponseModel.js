import { UserProfileResponseModel } from "./utils/UserProfileResponseModel";

class UsersOfCommunityResponseModel {
    user = undefined;
    role = undefined;

    constructor(values) {
        user = new UserProfileResponseModel(values.user);
        role = values.user;
    }
}

export {
    UsersOfCommunityResponseModel
}