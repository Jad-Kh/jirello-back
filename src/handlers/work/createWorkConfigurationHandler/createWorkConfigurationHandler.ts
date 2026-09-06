import { WorkConfigurationQueries } from "../../../database/queries/work.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateWorkConfigurationRequest } from "./createWorkConfigurationRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { invalidateCacheNamespace } from "../../../infrastructure/redisCache.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { isCommunityManager } from "../../../security/domainAccess.js";
import { scopedAccess, workConfigurationNamespace } from "../../../services/work/workService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function createWorkConfigurationHandler(
    request: IRequest<CreateWorkConfigurationRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await scopedAccess(request.userId!, value.communityId, value.projectId);
        if (!context || !isCommunityManager(context, request.userId!)) {
            response
                .status(403)
                .json({ ...WorkErrorResponses.ONLY_COMMUNITY_MANAGERS_CAN_CONFIGURE_WORK_TYPES });
            return;
        }
        const statusKeys = new Set(value.statuses.map((status: { key: string }) => status.key));
        if (
            value.transitions.some(
                (transition: { from: string; to: string }) =>
                    !statusKeys.has(transition.from) || !statusKeys.has(transition.to),
            )
        ) {
            response
                .status(400)
                .json({ ...WorkErrorResponses.EVERY_TRANSITION_MUST_REFERENCE_A_DECLARED_STATUS });
            return;
        }
        const configuration = await runInTransaction(async () => {
            if (value.isDefault) {
                await WorkConfigurationQueries.updateWorkConfigurationsQuery(
                    { communityId: value.communityId, projectId: value.projectId, isDefault: true },
                    { $set: { isDefault: false } },
                    { session: getTransactionSession() },
                );
            }
            const saved = await WorkConfigurationQueries.createWorkConfigurationQuery(value);
            await enqueueRealtimeEvent({
                channels: [
                    value.projectId
                        ? RealtimeChannels.project(value.projectId)
                        : RealtimeChannels.community(value.communityId),
                ],
                eventName: "work-configuration-created-v1",
                actorId: request.userId!,
                aggregate: { type: "work-configuration", id: saved.id, version: saved.version },
                data: { configuration: saved.toObject({ virtuals: true }) },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return saved;
        });
        await invalidateCacheNamespace(workConfigurationNamespace(value.communityId));
        request.responseModel = configuration;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
