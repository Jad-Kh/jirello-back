import { UserResponse } from "./UserResponse.js";

export class UsersOfEntityResponse {
    users: UserResponse[];

    constructor(values: UsersOfEntityResponse | UserResponse[]) {
        const users = Array.isArray(values) ? values : values.users;
        this.users = users.map((user) => new UserResponse(user));
    }
}
