import { UserResponse } from "./UserResponse.js";

export class UsersOfCommunityResponse {
    users: { user: UserResponse; role: "owner" | "user" }[];

    constructor(values: UsersOfCommunityResponse | UsersOfCommunityResponse["users"]) {
        this.users = Array.isArray(values) ? values : values.users;
    }
}
