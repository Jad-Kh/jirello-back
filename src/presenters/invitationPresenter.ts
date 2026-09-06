import { createPresenter } from "../helpers/presenting.js";
import { CommunityInvitationResponse } from "../models/invitation/CommunityInvitationResponse.js";
import { CommunityInvitationsResponse } from "../models/invitation/CommunityInvitationsResponse.js";
import { InvitationSuccessResponses } from "../responses/success/InvitationSuccessResponses.js";

export const getInvitationsPresenter = createPresenter(
    InvitationSuccessResponses.INVITATIONS_LOADED,
    CommunityInvitationsResponse,
);
export const createInvitationPresenter = createPresenter(
    InvitationSuccessResponses.COMMUNITY_INVITATION_SENT,
    CommunityInvitationResponse,
);
export const respondToInvitationPresenter = createPresenter(
    InvitationSuccessResponses.DEFAULT,
    CommunityInvitationResponse,
);
