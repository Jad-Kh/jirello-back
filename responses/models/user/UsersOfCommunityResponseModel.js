import { UserOfCommunityResponseModel } from "./utils/UserOfCommunityResponseModel.js";

class UsersOfCommunityResponseModel {
    users = [];

    constructor(values) {
        this.users = values?.map(user =>  new UserOfCommunityResponseModel(user));
    }
}

export {
    UsersOfCommunityResponseModel
}