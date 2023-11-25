import { UserProfileResponseModel } from "./UserProfileResponseModel.js";

class UserOfRoleResponseModel {
    profile = undefined;
    role = undefined;

    constructor(values) {
        this.profile = new UserProfileResponseModel(values.user.profile);
        this.role = values.role;
    }
}

export {
    UserOfRoleResponseModel
}