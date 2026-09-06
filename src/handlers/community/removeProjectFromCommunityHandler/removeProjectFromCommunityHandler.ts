import { NextFunction } from "express";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ProjectQueries } from "../../../database/queries/project.js";
import { runInTransaction } from "../../../database/transaction.js";
import { IRequest, IResponse } from "../../../helpers/api.js";
import { catchError } from "../../../helpers/errorLogging.js";
import { checkSecurity } from "../../../helpers/security.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { authorizeResourceCommunity } from "../../../security/resourceSecurity.js";
import { RemoveProjectFromCommunityRequest } from "./removeProjectFromCommunityRequest.js";
import { removeProjectFromCommunitySecurity } from "./removeProjectFromCommunitySecurity.js";

export const removeProjectFromCommunityHandler = async (
    req: IRequest<RemoveProjectFromCommunityRequest, "community">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel!;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel.communityId);
        const project = await ProjectQueries.getProjectByIdQuery(requestModel.projectId);
        if (project && !authorizeResourceCommunity(res, req.community, project.communityId)) return;
        if (checkSecurity(removeProjectFromCommunitySecurity(res, community, project))) {
            await runInTransaction(async () => {
                await CommunityQueries.removeProjectFromCommunityQuery(
                    requestModel.communityId,
                    requestModel.projectId,
                );
                await ProjectQueries.deleteProjectQuery(requestModel.projectId);
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.community(requestModel.communityId),
                        RealtimeChannels.project(requestModel.projectId),
                    ],
                    eventName: "community-project-removed-v1",
                    actorId: req.userId,
                    aggregate: { type: "community-project", id: requestModel.projectId, version: Date.now() },
                    data: { communityId: requestModel.communityId, projectId: requestModel.projectId },
                    socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                });
            });
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, removeProjectFromCommunityHandler.name);
    }
};
