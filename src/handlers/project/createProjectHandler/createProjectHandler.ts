import { NextFunction } from "express";
import { ICommunity } from "../../../database/models/community/ICommunity.js";
import { IProject } from "../../../database/models/project/IProject.js";
import { CommunityQueries } from "../../../database/queries/community.js";
import { ProjectQueries } from "../../../database/queries/project.js";
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
import { createProjectMapper } from "./createProjectMapper.js";
import { CreateProjectRequest } from "./createProjectRequest.js";
import { createProjectSecurity } from "./createProjectSecurity.js";

export const createProjectHandler = async (
    req: IRequest<CreateProjectRequest, "project">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const community = (await CommunityQueries.getCommunityByIdQuery(
            requestModel?.communityId as string,
        )) as ICommunity;
        const existingProject = (await ProjectQueries.getProjectByNameQuery(
            requestModel?.name as string,
            requestModel?.communityId,
        )) as IProject;
        const userId = req.userId as string;
        if (checkSecurity(createProjectSecurity(res, community, userId, existingProject))) {
            const project = await createProjectMapper(requestModel as CreateProjectRequest, userId);
            const savedProject = await runInTransaction(async () => {
                const saved = await ProjectQueries.createProjectQuery(project);
                await CommunityQueries.addProjectToCommunityQuery(
                    requestModel!.communityId,
                    saved._id.toString(),
                );
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.community(requestModel!.communityId),
                        RealtimeChannels.project(saved.id),
                    ],
                    eventName: "project-created-v1",
                    actorId: req.userId,
                    aggregate: { type: "project", id: saved.id, version: realtimeVersion(saved) },
                    data: { project: realtimeDocument(saved) },
                    socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                });
                return saved;
            });
            req.project = savedProject;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, createProjectHandler.name);
    }
};
