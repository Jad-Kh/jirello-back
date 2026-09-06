import type { ICommunityInvitation } from "../../database/models/invitation/ICommunityInvitation.js";
import { APISignature } from "../api/APISignature.js";

export class CommunityInvitationResponse extends APISignature {
    communityId: string;
    invitedUserId: string;
    invitedBy: string;
    status: ICommunityInvitation["status"];
    expiresAt: Date;
    respondedAt?: Date;

    constructor(values: ICommunityInvitation & { id?: string; _id?: string }) {
        super(values);
        this.communityId = values.communityId;
        this.invitedUserId = values.invitedUserId;
        this.invitedBy = values.invitedBy;
        this.status = values.status;
        this.expiresAt = values.expiresAt;
        this.respondedAt = values.respondedAt;
    }
}
