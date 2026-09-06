export type RecoveryRequest = {
    email: string;
};

export type ResetPasswordRequest = {
    token: string;
    password: string;
};
