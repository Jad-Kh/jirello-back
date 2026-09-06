import { WorkConfigurationQueries } from "../../../database/queries/work.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateWorkConfigurationRequest } from "./updateWorkConfigurationRequest.js";
import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { invalidateCacheNamespace } from "../../../infrastructure/redisCache.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { isCommunityManager } from "../../../security/domainAccess.js";
import { scopedAccess, workConfigurationNamespace } from "../../../services/work/workService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function updateWorkConfigurationHandler(
    request: IRequest<UpdateWorkConfigurationRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const existing = await WorkConfigurationQueries.getWorkConfigurationByIdQuery(request.params.id);
        const value = request.requestModel!;
        const context = existing
            ? await scopedAccess(request.userId!, existing.communityId, existing.projectId)
            : undefined;
        if (!existing || !context || !isCommunityManager(context, request.userId!)) {
            response.status(403).json({ ...WorkErrorResponses.WORK_CONFIGURATION_ACCESS_DENIED });
            return;
        }
        const { version, communityId: _communityId, projectId: _projectId, ...updates } = value;
        const configuration = await runInTransaction(async () => {
            if (updates.isDefault) {
                await WorkConfigurationQueries.updateWorkConfigurationsQuery(
                    {
                        communityId: existing.communityId,
                        projectId: existing.projectId,
                        isDefault: true,
                        _id: { $ne: existing.id },
                    },
                    { $set: { isDefault: false } },
                    { session: getTransactionSession() },
                );
            }
            const updated = await WorkConfigurationQueries.updateWorkConfigurationQuery(
                { _id: existing.id, version },
                { $set: updates, $inc: { version: 1 } },
                { new: true, session: getTransactionSession() },
            );
            if (updated) {
                await enqueueRealtimeEvent({
                    channels: [
                        updated.projectId
                            ? RealtimeChannels.project(updated.projectId)
                            : RealtimeChannels.community(updated.communityId),
                    ],
                    eventName: "work-configuration-updated-v1",
                    actorId: request.userId!,
                    aggregate: { type: "work-configuration", id: updated.id, version: updated.version },
                    data: { configuration: updated.toObject({ virtuals: true }) },
                    socketId: pusherSocketId(request.header("x-pusher-socket-id")),
                });
            }
            return updated;
        });
        if (!configuration) {
            response
                .status(409)
                .json({ ...WorkErrorResponses.WORK_CONFIGURATION_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        await invalidateCacheNamespace(workConfigurationNamespace(existing.communityId));
        request.responseModel = configuration;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
