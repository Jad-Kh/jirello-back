import { NextFunction } from "express";
import { CommunityQueries } from "../../../database/queries/community.js";
import { runInTransaction } from "../../../database/transaction.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId, realtimeVersion } from "../../../realtime/events.js";
import { UpdateCommunityPermissionsRequest } from "./updateCommunityPermissionsRequest.js";
import { updateCommunityPermissionsSecurity } from "./updateCommunityPermissionsSecurity.js";

export const updateCommunityPermissionsHandler = async (
    req: IRequest<UpdateCommunityPermissionsRequest, "community">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel?.id as string);
        if (checkSecurity(updateCommunityPermissionsSecurity(res, community))) {
            const { id, ...permissions } = requestModel as UpdateCommunityPermissionsRequest;
            const updatedCommunity = await runInTransaction(async () => {
                const updated = await CommunityQueries.updateCommunityPermissionsQuery(id, permissions);
                if (updated) {
                    await enqueueRealtimeEvent({
                        channels: [RealtimeChannels.community(id)],
                        eventName: "community-permissions-updated-v1",
                        actorId: req.userId,
                        aggregate: { type: "community", id, version: realtimeVersion(updated) },
                        data: { permissions: updated.permissions },
                        socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                    });
                }
                return updated;
            });
            req.community = updatedCommunity;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, updateCommunityPermissionsHandler.name);
    }
};
