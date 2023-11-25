import { UserOfRoleResponseModel } from "./utils/UserOfRoleResponseModel.js";

class UsersOfRoleResponseModel {
    users = [];

    constructor(values) {
        this.users = values?.map(user =>  new UserOfRoleResponseModel(user));
    }
}

export {
    UsersOfRoleResponseModel
}