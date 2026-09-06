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
import { RemoveUserFromCommunityRequest } from "./removeUserFromCommunityRequest.js";
import { removeUserFromCommunitySecurity } from "./removeUserFromCommunitySecurity.js";

export const removeUserFromCommunityHandler = async (
    req: IRequest<RemoveUserFromCommunityRequest, "community">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = (await CommunityQueries.getCommunityByIdQuery(
            requestModel?.communityId as string,
        )) as ICommunity;
        const user = (await UserQueries.getUserByIdQuery(requestModel?.userId as string)) as IUser;

        if (checkSecurity(removeUserFromCommunitySecurity(res, community, user, requestModel))) {
            await runInTransaction(async () => {
                await CommunityQueries.removeUserFromCommunityQuery(
                    requestModel?.communityId as string,
                    requestModel?.userId as string,
                );
                await UserQueries.removeCommunityFromUserQuery(
                    requestModel?.userId as string,
                    requestModel?.communityId as string,
                );
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.community(requestModel!.communityId),
                        RealtimeChannels.user(requestModel!.userId),
                    ],
                    eventName: "community-member-removed-v1",
                    actorId: req.userId,
                    aggregate: {
                        type: "community-membership",
                        id: requestModel!.communityId,
                        version: Date.now(),
                    },
                    data: { communityId: requestModel!.communityId, userId: requestModel!.userId },
                    socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                    terminateUserId: requestModel!.userId,
                });
                await createNotification({
                    recipientId: requestModel!.userId,
                    actorId: req.userId,
                    communityId: requestModel!.communityId,
                    resourceType: "community",
                    resourceId: requestModel!.communityId,
                    type: "community-removed",
                    title: "Removed from community",
                    body: `Your access to ${community.name} was removed.`,
                });
            });
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, removeUserFromCommunityHandler.name);
    }
};
