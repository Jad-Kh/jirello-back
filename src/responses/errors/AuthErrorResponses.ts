const AuthErrorResponses = {
    SIGNUP_VALIDATION_ERROR: {
        message: "Signup error.",
        code: 400,
    },
    LOGIN_VALIDATION_ERROR: {
        message: "Login error.",
        code: 400,
    },
    EMAIL_EXISTS_ERROR: {
        message: "Account with this email already exists.",
        code: 400,
    },
    USERNAME_EXISTS_ERROR: {
        message: "Username already taken.",
        code: 400,
    },
    LOGIN_EMAIL_ERROR: {
        message: "Email or password is incorrect.",
        code: 400,
    },
    LOGIN_USERNAME_ERROR: {
        message: "Username or password is incorrect.",
        code: 400,
    },
    EMAIL_NOT_EXISTS_ERROR: {
        message: "No account with this email.",
        code: 404,
    },
    INVALID_EMAIL: {
        message: "Invalid email.",
        code: 400,
    },
};

export { AuthErrorResponses };
