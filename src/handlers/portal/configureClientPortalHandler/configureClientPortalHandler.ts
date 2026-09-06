import { ClientPortalQueries } from "../../../database/queries/portal.js";
import type { IRequest } from "../../../helpers/api.js";
import type { ConfigureClientPortalRequest } from "./configureClientPortalRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId, realtimeVersion } from "../../../realtime/events.js";
import { isCommunityManager, projectAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function configureClientPortalHandler(
    request: IRequest<ConfigureClientPortalRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await projectAccess(request.userId!, request.params.projectId, "projects", [
            Permissions.EDIT_OTHER,
        ]);
        if (!context || !isCommunityManager(context, request.userId!)) {
            response.status(403).json({ ...PortalErrorResponses.CLIENT_PORTAL_CONFIGURATION_ACCESS_DENIED });
            return;
        }
        const portal = await runInTransaction(async () => {
            const updated = await ClientPortalQueries.updateClientPortalQuery(
                { projectId: request.params.projectId },
                {
                    $set: {
                        ...value,
                        projectId: request.params.projectId,
                        communityId: context.community.id,
                    },
                },
                { new: true, upsert: true, setDefaultsOnInsert: true, session: getTransactionSession() },
            );
            if (!updated) throw new Error("Client portal upsert did not return a document.");
            await enqueueRealtimeEvent({
                channels: [RealtimeChannels.project(request.params.projectId)],
                eventName: "client-portal-updated-v1",
                actorId: request.userId!,
                aggregate: { type: "client-portal", id: updated.id, version: realtimeVersion(updated) },
                data: { portal: updated.toObject({ virtuals: true }) },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return updated;
        });
        request.responseModel = portal;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
