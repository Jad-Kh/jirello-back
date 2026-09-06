import type { ICommunityInvitation } from "../../database/models/invitation/ICommunityInvitation.js";
import { CommunityInvitationResponse } from "./CommunityInvitationResponse.js";

export class CommunityInvitationsResponse extends Array<CommunityInvitationResponse> {
    constructor(values: ICommunityInvitation[]) {
        super(...values.map((invitation) => new CommunityInvitationResponse(invitation)));
    }
}
