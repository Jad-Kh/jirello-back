import { UserResponse } from "../user/UserResponse.js";

export class AuthResponse {
    accessToken: string;
    user: UserResponse;

    constructor(values: AuthResponse) {
        this.accessToken = values.accessToken;
        this.user = new UserResponse(values.user);
    }
}
