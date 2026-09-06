import { WorkConfigurationQueries } from "../../../database/queries/work.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { invalidateCacheNamespace } from "../../../infrastructure/redisCache.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { isCommunityManager } from "../../../security/domainAccess.js";
import { scopedAccess, workConfigurationNamespace } from "../../../services/work/workService.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function archiveWorkConfigurationHandler(
    request: ExpressRequest<{ id: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const configuration = await WorkConfigurationQueries.getWorkConfigurationByIdQuery(request.params.id);
        const context = configuration
            ? await scopedAccess(request.userId!, configuration.communityId, configuration.projectId)
            : undefined;
        if (!configuration || !context || !isCommunityManager(context, request.userId!)) {
            response.status(403).json({ ...WorkErrorResponses.WORK_CONFIGURATION_ACCESS_DENIED });
            return;
        }
        const archived = await runInTransaction(async () => {
            const updated = await WorkConfigurationQueries.updateWorkConfigurationQuery(
                { _id: configuration.id, version: configuration.version },
                { $set: { archivedAt: new Date() }, $inc: { version: 1 } },
                { new: true, session: getTransactionSession() },
            );
            if (!updated) throw new Error("Work configuration changed before it could be archived.");
            await enqueueRealtimeEvent({
                channels: [
                    updated.projectId
                        ? RealtimeChannels.project(updated.projectId)
                        : RealtimeChannels.community(updated.communityId),
                ],
                eventName: "work-configuration-archived-v1",
                actorId: request.userId!,
                aggregate: {
                    type: "work-configuration",
                    id: updated.id,
                    version: updated.version,
                },
                data: { configurationId: updated.id },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return updated;
        });
        await invalidateCacheNamespace(workConfigurationNamespace(archived.communityId));
        request.responseModel = { id: archived.id };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
