import { CommunityInvitationQueries } from "../../../database/queries/invitation.js";
import type { IRequest } from "../../../helpers/api.js";
import type { RespondToInvitationRequest } from "./respondToInvitationRequest.js";

import { CommunityQueries } from "../../../database/queries/community.js";
import { UserQueries } from "../../../database/queries/user.js";
import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { InvitationErrorResponses } from "../../../responses/errors/InvitationErrorResponses.js";

export async function respondToInvitationHandler(
    request: IRequest<RespondToInvitationRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        if (!/^[a-f\d]{24}$/i.test(request.params.id)) {
            response.status(400).json({ code: 400, message: "Invalid invitation ID." });
            return;
        }
        const invitation = await CommunityInvitationQueries.getCommunityInvitationQuery({
            _id: request.params.id,
            invitedUserId: request.userId!,
            status: "pending",
            expiresAt: { $gt: new Date() },
        });
        const community = invitation
            ? await CommunityQueries.getCommunityByIdQuery(invitation.communityId)
            : undefined;
        if (!invitation || !community) {
            response.status(404).json({ ...InvitationErrorResponses.ACTIVE_INVITATION_NOT_FOUND });
            return;
        }
        const respondedAt = new Date();
        const updated = await runInTransaction(async () => {
            const saved = await CommunityInvitationQueries.updateCommunityInvitationQuery(
                { _id: invitation.id, status: "pending" },
                { $set: { status: value.decision, respondedAt } },
                { new: true, session: getTransactionSession() },
            );
            if (!saved) return null;
            if (value.decision === "accepted") {
                await CommunityQueries.addUserToCommunityQuery(invitation.communityId, request.userId!);
                await UserQueries.addCommunityToUserQuery(request.userId!, invitation.communityId);
            }
            await enqueueRealtimeEvent({
                channels: [
                    RealtimeChannels.user(request.userId!),
                    ...(value.decision === "accepted"
                        ? [RealtimeChannels.community(invitation.communityId)]
                        : []),
                ],
                eventName: `community-invitation-${value.decision}-v1`,
                actorId: request.userId!,
                aggregate: {
                    type: "community-invitation",
                    id: invitation.id,
                    version: respondedAt.getTime(),
                },
                data: {
                    invitationId: invitation.id,
                    communityId: invitation.communityId,
                    userId: request.userId!,
                    decision: value.decision,
                },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return saved;
        });
        if (!updated) {
            response.status(409).json({ ...InvitationErrorResponses.INVITATION_WAS_ALREADY_HANDLED });
            return;
        }
        request.responseModel = updated;
        request.successResponse = { code: 200, message: `Invitation ${value.decision}.` };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
