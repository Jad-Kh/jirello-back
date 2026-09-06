import { ICommon } from "../ICommon.js";

export type IGuestAccess = ICommon & {
    communityId: string;
    projectId: string;
    userId: string;
    invitedBy: string;
    role: "viewer" | "commenter" | "approver";
    status: "active" | "revoked";
    expiresAt?: Date;
    revokedAt?: Date;
};
