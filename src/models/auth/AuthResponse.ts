export class AuthResponse {
    refreshToken: string;
    accessToken: string;
    id: string;

    constructor(values: AuthResponse) {
        this.refreshToken = values.refreshToken;
        this.accessToken = values.accessToken;
        this.id = values.id;
    }
}