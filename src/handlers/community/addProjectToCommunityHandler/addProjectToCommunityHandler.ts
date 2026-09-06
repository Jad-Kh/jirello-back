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
import { AddProjectToCommunityRequest } from "./addProjectToCommunityRequest.js";
import { addProjectToCommunitySecurity } from "./addProjectToCommunitySecurity.js";

export const addProjectToCommunityHandler = async (
    req: IRequest<AddProjectToCommunityRequest, "community">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = await CommunityQueries.getCommunityByIdQuery(requestModel?.communityId as string);
        const project = await ProjectQueries.getProjectByIdQuery(requestModel?.projectId as string);
        if (project?.communityId && !authorizeResourceCommunity(res, req.community, project.communityId))
            return;
        if (checkSecurity(addProjectToCommunitySecurity(res, community, project))) {
            await runInTransaction(async () => {
                await CommunityQueries.addProjectToCommunityQuery(
                    requestModel?.communityId as string,
                    requestModel?.projectId as string,
                );
                await ProjectQueries.updateProjectCommunityQuery(
                    requestModel?.projectId as string,
                    requestModel?.communityId as string,
                );
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.community(requestModel!.communityId),
                        RealtimeChannels.project(requestModel!.projectId),
                    ],
                    eventName: "community-project-added-v1",
                    actorId: req.userId,
                    aggregate: {
                        type: "community-project",
                        id: requestModel!.projectId,
                        version: Date.now(),
                    },
                    data: { communityId: requestModel!.communityId, projectId: requestModel!.projectId },
                    socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                });
            });
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, addProjectToCommunityHandler.name);
    }
};
