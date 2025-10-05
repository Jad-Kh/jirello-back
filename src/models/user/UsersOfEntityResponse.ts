import { UserResponse } from "./UserResponse.ts";

export class UsersOfEntityResponse {
    users: UserResponse[];

    constructor(values: UsersOfEntityResponse) {
        this.users = values.users;
    }
}