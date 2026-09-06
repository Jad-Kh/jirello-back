import { DeliverableQueries, GuestAccessQueries } from "../../../database/queries/portal.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateDeliverableRequest } from "./createDeliverableRequest.js";
import { TaskQueries } from "../../../database/queries/task.js";

import { runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { projectAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function createDeliverableHandler(
    request: IRequest<CreateDeliverableRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await projectAccess(request.userId!, request.params.projectId, "tasks", [
            Permissions.CREATE_OWN,
        ]);
        if (!context) {
            response.status(403).json({ ...PortalErrorResponses.DELIVERABLE_CREATION_ACCESS_DENIED });
            return;
        }
        if (
            value.taskId &&
            !(await TaskQueries.taskExistsQuery({ _id: value.taskId, projectId: request.params.projectId }))
        ) {
            response
                .status(400)
                .json({ ...PortalErrorResponses.DELIVERABLE_TASK_MUST_BELONG_TO_THE_PROJECT });
            return;
        }
        const deliverable = await runInTransaction(async () => {
            const saved = await DeliverableQueries.createDeliverableQuery({
                ...value,
                projectId: request.params.projectId,
                communityId: context.community.id,
                createdBy: request.userId!,
                status: value.submit ? "submitted" : "draft",
                submittedAt: value.submit ? new Date() : undefined,
            });
            const guests = value.submit
                ? await GuestAccessQueries.getGuestAccessesQuery({
                      projectId: request.params.projectId,
                      status: "active",
                  })
                : [];
            await enqueueRealtimeEvent({
                channels: [
                    RealtimeChannels.project(request.params.projectId),
                    ...guests.map((guest) => RealtimeChannels.user(guest.userId)),
                ].slice(0, 100),
                eventName: "deliverable-created-v1",
                actorId: request.userId!,
                aggregate: { type: "deliverable", id: saved.id, version: saved.version },
                data: { deliverable: saved.toObject({ virtuals: true }) },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return saved;
        });
        request.responseModel = deliverable;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
