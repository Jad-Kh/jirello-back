export class RefreshTokenResponse {
    token: string;

    constructor(values: RefreshTokenResponse) {
        this.token = values.token;
    }
}
