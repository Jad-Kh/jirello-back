import { CommunityInvitationQueries } from "../../../database/queries/invitation.js";

import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";

export async function getInvitationsHandler(
    request: ExpressRequest,
    _response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        await CommunityInvitationQueries.updateCommunityInvitationsQuery(
            { invitedUserId: request.userId!, status: "pending", expiresAt: { $lte: new Date() } },
            { $set: { status: "expired" } },
        );
        const invitations = await CommunityInvitationQueries.getCommunityInvitationsQuery({
            invitedUserId: request.userId!,
            status: "pending",
        }).sort({ createdAt: -1 });
        request.responseModel = invitations;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
