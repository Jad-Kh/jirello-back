import { CommunityInvitationQueries } from "../../../database/queries/invitation.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateInvitationRequest } from "./createInvitationRequest.js";

import { CommunityQueries } from "../../../database/queries/community.js";
import { UserQueries } from "../../../database/queries/user.js";
import { runInTransaction } from "../../../database/transaction.js";
import { hasPermission, Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, realtimeVersion } from "../../../realtime/events.js";
import { getUserEffectivePermissions } from "../../../security/permissionSecurity.js";
import { isCommunityMember } from "../../../security/resourceSecurity.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { InvitationErrorResponses } from "../../../responses/errors/InvitationErrorResponses.js";

export async function createInvitationHandler(
    request: IRequest<CreateInvitationRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const [community, actor, invitedUser] = await Promise.all([
            CommunityQueries.getCommunityByIdQuery(value.communityId),
            UserQueries.getUserByIdQuery(request.userId!),
            UserQueries.getUserByIdQuery(value.userId),
        ]);
        if (!community || !actor || !invitedUser || !isCommunityMember(community, actor.id)) {
            response.status(403).json({ ...InvitationErrorResponses.COMMUNITY_INVITATION_ACCESS_DENIED });
            return;
        }
        const permissions = await getUserEffectivePermissions(actor, community);
        if (!hasPermission(permissions, "users", [Permissions.CHANGE_OTHER])) {
            response.status(403).json({ ...InvitationErrorResponses.COMMUNITY_INVITATION_ACCESS_DENIED });
            return;
        }
        if (isCommunityMember(community, invitedUser.id)) {
            response.status(409).json({ ...InvitationErrorResponses.USER_IS_ALREADY_A_COMMUNITY_MEMBER });
            return;
        }
        await CommunityInvitationQueries.updateCommunityInvitationsQuery(
            {
                communityId: value.communityId,
                invitedUserId: value.userId,
                status: "pending",
                expiresAt: { $lte: new Date() },
            },
            { $set: { status: "expired" } },
        );
        const existing = await CommunityInvitationQueries.getCommunityInvitationQuery({
            communityId: value.communityId,
            invitedUserId: value.userId,
            status: "pending",
            expiresAt: { $gt: new Date() },
        });
        if (existing) {
            response.status(409).json({ ...InvitationErrorResponses.A_PENDING_INVITATION_ALREADY_EXISTS });
            return;
        }
        const invitation = await runInTransaction(async () => {
            const saved = await CommunityInvitationQueries.createCommunityInvitationQuery({
                communityId: value.communityId,
                invitedUserId: value.userId,
                invitedBy: request.userId!,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60_000),
            });
            await createNotification({
                recipientId: value.userId,
                actorId: request.userId!,
                communityId: value.communityId,
                resourceType: "community-invitation",
                resourceId: saved.id,
                type: "community-invitation",
                title: "Community invitation",
                body: `${actor.profile.username} invited you to ${community.name}.`,
            });
            await enqueueRealtimeEvent({
                channels: [RealtimeChannels.user(value.userId)],
                eventName: "community-invitation-created-v1",
                actorId: request.userId!,
                aggregate: { type: "community-invitation", id: saved.id, version: realtimeVersion(saved) },
                data: { invitation: saved.toObject({ virtuals: true }), communityName: community.name },
            });
            return saved;
        });
        request.responseModel = invitation;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
