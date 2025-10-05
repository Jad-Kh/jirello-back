import { UserResponse } from "./UserResponse.ts";

export class UsersOfCommunityResponse {
    users: { user: UserResponse[], role: string }[];

    constructor(values: UsersOfCommunityResponse) {
        this.users = values.users;
    }
}