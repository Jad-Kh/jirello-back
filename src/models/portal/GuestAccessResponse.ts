import type { IGuestAccess } from "../../database/models/portal/IGuestAccess.js";
import { APISignature } from "../api/APISignature.js";

export class GuestAccessResponse extends APISignature {
    communityId: string;
    projectId: string;
    userId: string;
    invitedBy: string;
    role: IGuestAccess["role"];
    status: IGuestAccess["status"];
    expiresAt?: Date;
    revokedAt?: Date;

    constructor(values: IGuestAccess) {
        super(values);
        this.communityId = values.communityId;
        this.projectId = values.projectId;
        this.userId = values.userId;
        this.invitedBy = values.invitedBy;
        this.role = values.role;
        this.status = values.status;
        this.expiresAt = values.expiresAt;
        this.revokedAt = values.revokedAt;
    }
}
