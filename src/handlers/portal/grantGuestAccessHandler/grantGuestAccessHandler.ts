import { GuestAccessQueries } from "../../../database/queries/portal.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GrantGuestAccessRequest } from "./grantGuestAccessRequest.js";

import { UserQueries } from "../../../database/queries/user.js";
import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, realtimeVersion } from "../../../realtime/events.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import { isCommunityManager, projectAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function grantGuestAccessHandler(
    request: IRequest<GrantGuestAccessRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const [context, guestUser] = await Promise.all([
            projectAccess(request.userId!, request.params.projectId, "projects", [Permissions.EDIT_OTHER]),
            UserQueries.getUserByIdQuery(value.userId),
        ]);
        if (!context || !isCommunityManager(context, request.userId!)) {
            response.status(403).json({ ...PortalErrorResponses.GUEST_MANAGEMENT_ACCESS_DENIED });
            return;
        }
        if (!guestUser) {
            response.status(400).json({ ...PortalErrorResponses.GUEST_USER_DOES_NOT_EXIST });
            return;
        }
        const access = await runInTransaction(async () => {
            const saved = await GuestAccessQueries.updateGuestAccessQuery(
                { projectId: request.params.projectId, userId: value.userId },
                {
                    $set: {
                        ...value,
                        projectId: request.params.projectId,
                        communityId: context.community.id,
                        invitedBy: request.userId!,
                        status: "active",
                    },
                    $unset: { revokedAt: 1 },
                },
                { new: true, upsert: true, setDefaultsOnInsert: true, session: getTransactionSession() },
            );
            if (!saved) throw new Error("Guest access upsert did not return a document.");
            await createNotification({
                recipientId: value.userId,
                actorId: request.userId!,
                communityId: context.community.id,
                projectId: request.params.projectId,
                resourceType: "client-portal",
                resourceId: request.params.projectId,
                type: "client-portal-invitation",
                title: "Client portal invitation",
                body: `You now have ${value.role} access to ${context.project.name}.`,
            });
            await enqueueRealtimeEvent({
                channels: [RealtimeChannels.user(value.userId)],
                eventName: "client-access-granted-v1",
                actorId: request.userId!,
                aggregate: { type: "guest-access", id: saved.id, version: realtimeVersion(saved) },
                data: { access: saved.toObject({ virtuals: true }) },
            });
            return saved;
        });
        request.responseModel = access;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
