import { NextFunction } from "express";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { UserQueries } from "../../../database/queries/user.js";
import { runInTransaction } from "../../../database/transaction.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { CommunityResponse } from "../../../models/community/CommunityResponse.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import {
    enqueueRealtimeEvent,
    pusherSocketId,
    realtimeDocument,
    realtimeVersion,
} from "../../../realtime/events.js";
import { createCommunityMapper } from "./createCommunityMapper.js";
import { CommunityRequest } from "./createCommunityRequest.js";
import { createCommunitySecurity } from "./createCommunitySecurity.js";

export const createCommunityHandler = async (
    req: IRequest<CommunityRequest, "community">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const communityByName = (await CommunityQueries.getCommunityByNameQuery(
            requestModel?.name as string,
        )) as ICommunity;
        const communityByFlag = (await CommunityQueries.getCommunityByFlagQuery(
            requestModel?.flag as string,
        )) as ICommunity;
        if (checkSecurity(createCommunitySecurity(res, communityByName, communityByFlag))) {
            const mappedCommunity = await createCommunityMapper(
                requestModel as CommunityRequest,
                req.userId as string,
            );
            const newCommunity = new CommunityResponse(mappedCommunity);
            const savedCommunity = await runInTransaction(async () => {
                const saved = await CommunityQueries.createCommunityQuery(newCommunity as ICommunity);
                await UserQueries.addCommunityToUserOwnedQuery(req.userId as string, saved._id.toString());
                await enqueueRealtimeEvent({
                    channels: [RealtimeChannels.community(saved.id), RealtimeChannels.user(req.userId!)],
                    eventName: "community-created-v1",
                    actorId: req.userId,
                    aggregate: { type: "community", id: saved.id, version: realtimeVersion(saved) },
                    data: { community: realtimeDocument(saved) },
                    socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                });
                return saved;
            });
            req.community = savedCommunity;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, createCommunityHandler.name);
    }
};
