import { ICommon } from "../ICommon.js";

export type IUserAccess = ICommon & {
    refreshToken: string;
    passwordResetToken?: string;
    passwordResetExpiresAt?: Date;
};
