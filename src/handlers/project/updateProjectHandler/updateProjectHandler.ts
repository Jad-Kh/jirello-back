import { NextFunction } from "express";
import { IProject } from "../../../database/models/project/IProject.js";
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
import { authorizeResourceCommunity } from "../../../security/resourceSecurity.js";
import { UpdateProjectRequest } from "./updateProjectRequest.js";
import { updateProjectSecurity } from "./updateProjectSecurity.js";

export const updateProjectHandler = async (
    req: IRequest<UpdateProjectRequest, "project">,
    res: IResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const requestModel = req.requestModel;
        const project = (await ProjectQueries.getProjectByIdQuery(requestModel?.id as string)) as IProject;
        if (project && !authorizeResourceCommunity(res, req.community, project.communityId)) return;
        if (checkSecurity(updateProjectSecurity(res, project, req.userId as string))) {
            const { id, ...updateModel } = requestModel as UpdateProjectRequest;
            const updatedProject = await runInTransaction(async () => {
                const updated = await ProjectQueries.updateProjectQuery(id, updateModel);
                if (updated) {
                    await enqueueRealtimeEvent({
                        channels: [RealtimeChannels.project(id)],
                        eventName: "project-updated-v1",
                        actorId: req.userId,
                        aggregate: { type: "project", id, version: realtimeVersion(updated) },
                        data: {
                            project: realtimeDocument(updated),
                            changedFields: Object.keys(updateModel),
                        },
                        socketId: pusherSocketId(req.header("x-pusher-socket-id")),
                    });
                }
                return updated;
            });
            req.project = updatedProject;
            return next();
        }
    } catch (error) {
        catchError(error as Error, res, updateProjectHandler.name);
    }
};
