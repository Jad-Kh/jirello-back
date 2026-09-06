import { NextFunction } from "express";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { runInTransaction } from "../../../database/transaction.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import {
    enqueueRealtimeEvent,
    pusherSocketId,
    realtimeDocument,
    realtimeVersion,
} from "../../../realtime/events.js";
import { UpdateCommunityRequest } from "./updateCommunityRequest.js";
import { updateCommunitySecurity } from "./updateCommunitySecurity.js";

export const updateCommunityHandler = async (
    req: IRequest<UpdateCommunityRequest, "community">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = (await CommunityQueries.getCommunityByIdQuery(
            requestModel?.id as string,
        )) as ICommunity;
        if (checkSecurity(updateCommunitySecurity(res, community, req.userId as string))) {
            const { id, ...updateModel } = requestModel as UpdateCommunityRequest;
            const updatedCommunity = await runInTransaction(async () => {
                const updated = await CommunityQueries.updateCommunityQuery(id, updateModel);
                if (updated) {
                    await enqueueRealtimeEvent({
                        channels: [RealtimeChannels.community(id)],
                        eventName: "community-updated-v1",
                        actorId: req.userId,
                        aggregate: { type: "community", id, version: realtimeVersion(updated) },
                        data: {
                            community: realtimeDocument(updated),
                            changedFields: Object.keys(updateModel),
                        },
                        socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                    });
                }
                return updated;
            });
            req.community = updatedCommunity;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, updateCommunityHandler.name);
    }
};
