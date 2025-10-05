"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponse = void 0;
class AuthResponse {
    refreshToken;
    accessToken;
    id;
    constructor(values) {
        this.refreshToken = values.refreshToken;
        this.accessToken = values.accessToken;
        this.id = values.id;
    }
}
exports.AuthResponse = AuthResponse;
