const AuthErrorResponses = {

    SIGNUP_VALIDATION_ERROR: { 
        message: 'Signup error', 
        code: 400 
    },
    EMAIL_EXISTS_ERROR: {
        message: 'Account with this email already exists.',
        code: 400
    },
    USERNAME_EXISTS_ERROR: {
        message: 'Username already taken.',
        code: 400
    }
}

export {
    AuthErrorResponses
};