import { GuestAccessQueries } from "../../../database/queries/portal.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, realtimeVersion } from "../../../realtime/events.js";
import { isCommunityManager, projectAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function revokeGuestAccessHandler(
    request: ExpressRequest<{ id: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const access = await GuestAccessQueries.getGuestAccessByIdQuery(request.params.id);
        const context = access
            ? await projectAccess(request.userId!, access.projectId, "projects", [Permissions.EDIT_OTHER])
            : undefined;
        if (!access || !context || !isCommunityManager(context, request.userId!)) {
            response.status(403).json({ ...PortalErrorResponses.GUEST_MANAGEMENT_ACCESS_DENIED });
            return;
        }
        const revoked = await runInTransaction(async () => {
            const updated = await GuestAccessQueries.updateGuestAccessQuery(
                { _id: access.id, status: access.status },
                { $set: { status: "revoked", revokedAt: new Date() } },
                { new: true, session: getTransactionSession() },
            );
            if (!updated) throw new Error("Guest access changed before it could be revoked.");
            await enqueueRealtimeEvent({
                channels: [RealtimeChannels.user(updated.userId)],
                eventName: "client-access-revoked-v1",
                actorId: request.userId!,
                aggregate: { type: "guest-access", id: updated.id, version: realtimeVersion(updated) },
                data: { accessId: updated.id, projectId: updated.projectId },
            });
            return updated;
        });
        request.responseModel = { id: revoked.id };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
