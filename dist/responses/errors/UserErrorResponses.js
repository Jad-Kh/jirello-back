"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserErrorResponses = void 0;
const UserErrorResponses = {
    EMAIL_ERROR: {
        message: 'Invalid email',
        code: 400
    },
    PASSWORD_LENGTH_ERROR: {
        message: 'Password must be at least 8 characters',
        code: 400
    },
    DATE_ERROR: {
        message: 'Invalid date format',
        code: 400,
    },
    USERNAME_LENGTH_ERROR: {
        message: 'Username must be at least 2 characters and at most 30 characters',
        code: 400
    },
    FIRSTNAME_LENGTH_ERROR: {
        message: 'Firstname must be at least 2 characters and at most 25 characters',
        code: 400
    },
    LASTNAME_LENGTH_ERROR: {
        message: 'Lastname must be at least 2 characters and at most 25 characters',
        code: 400
    },
    USER_NOT_FOUND: {
        message: 'User not found or Id does not exist',
        code: 404
    },
    USERNAME_NOT_FOUND: {
        message: 'Username not found or does not exist',
        code: 404
    }
};
exports.UserErrorResponses = UserErrorResponses;
