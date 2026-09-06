import { NextFunction } from "express";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IUser } from "../../../database/models/user/IUser.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { UserQueries } from "../../../database/queries/user.js";
import { runInTransaction } from "../../../database/transaction.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { AddUserToCommunityRequest } from "./addUserToCommunityRequest.js";
import { addUserToCommunitySecurity } from "./addUserToCommunitySecurity.js";

export const addUserToCommunityHandler = async (
    req: IRequest<AddUserToCommunityRequest, "community">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = (await CommunityQueries.getCommunityByIdQuery(
            requestModel?.communityId as string,
        )) as ICommunity;
        const user = (await UserQueries.getUserByIdQuery(requestModel?.userId as string)) as IUser;
        if (checkSecurity(addUserToCommunitySecurity(res, community, user, requestModel))) {
            await runInTransaction(async () => {
                await CommunityQueries.addUserToCommunityQuery(
                    requestModel?.communityId as string,
                    requestModel?.userId as string,
                );
                await UserQueries.addCommunityToUserQuery(
                    requestModel?.userId as string,
                    requestModel?.communityId as string,
                );
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.community(requestModel!.communityId),
                        RealtimeChannels.user(requestModel!.userId),
                    ],
                    eventName: "community-member-added-v1",
                    actorId: req.userId,
                    aggregate: {
                        type: "community-membership",
                        id: requestModel!.communityId,
                        version: Date.now(),
                    },
                    data: { communityId: requestModel!.communityId, userId: requestModel!.userId },
                    socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                });
                await createNotification({
                    recipientId: requestModel!.userId,
                    actorId: req.userId,
                    communityId: requestModel!.communityId,
                    resourceType: "community",
                    resourceId: requestModel!.communityId,
                    type: "community-added",
                    title: "Added to community",
                    body: `You were added to ${community.name}.`,
                });
            });
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, addUserToCommunityHandler.name);
    }
};
