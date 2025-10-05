"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSuccessResponses = void 0;
const AuthSuccessResponses = {
    SIGNUP_SUCCESS: {
        message: 'User successfully registered!',
        code: 200
    },
    LOGIN_SUCCESS: {
        message: 'User successfully logged in!',
        code: 200
    },
    RECOVERY_SUCCESS: {
        message: 'Email successfully fetched',
        code: 200
    },
    REFRESH_TOKEN_SUCCESS: {
        message: 'Token successfully refreshed!',
        code: 200
    },
    LOGOUT_SUCCESS: {
        message: 'User successfully logged out',
        code: 204
    },
    REGISTER_SUCCESS: {
        message: 'User successfully registered!',
        code: 200
    }
};
exports.AuthSuccessResponses = AuthSuccessResponses;
