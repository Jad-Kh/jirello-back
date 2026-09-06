import {
    DeliverableQueries,
    GuestAccessQueries,
    PortalCommentQueries,
} from "../../../database/queries/portal.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateClientCommentRequest } from "./createClientCommentRequest.js";
import { TaskQueries } from "../../../database/queries/task.js";

import { runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId, realtimeVersion } from "../../../realtime/events.js";
import { projectAccess } from "../../../security/domainAccess.js";
import { activeGuest } from "../../../services/portal/portalService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function createClientCommentHandler(
    request: IRequest<CreateClientCommentRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const [guest, member] = await Promise.all([
            activeGuest(request.userId!, request.params.projectId),
            projectAccess(request.userId!, request.params.projectId, "tasks", [Permissions.CREATE_OWN]),
        ]);
        if ((!guest || guest.role === "viewer") && !member) {
            response.status(403).json({ ...PortalErrorResponses.CLIENT_COMMENT_CREATION_ACCESS_DENIED });
            return;
        }
        if (
            value.deliverableId &&
            !(await DeliverableQueries.deliverableExistsQuery({
                _id: value.deliverableId,
                projectId: request.params.projectId,
                status: { $ne: "draft" },
            }))
        ) {
            response.status(400).json({ ...PortalErrorResponses.DELIVERABLE_IS_NOT_VISIBLE_IN_THIS_PORTAL });
            return;
        }
        if (
            value.taskId &&
            !(await TaskQueries.taskExistsQuery({
                _id: value.taskId,
                projectId: request.params.projectId,
                audience: "client",
            }))
        ) {
            response.status(400).json({ ...PortalErrorResponses.TASK_IS_NOT_VISIBLE_IN_THIS_PORTAL });
            return;
        }
        const communityId = guest?.communityId ?? member!.community.id;
        const comment = await runInTransaction(async () => {
            const saved = await PortalCommentQueries.createPortalCommentQuery({
                ...value,
                communityId,
                projectId: request.params.projectId,
                authorId: request.userId!,
            });
            const recipients = await GuestAccessQueries.getGuestAccessesQuery({
                projectId: request.params.projectId,
                status: "active",
                userId: { $ne: request.userId! },
            });
            const memberIds = member ? [...member.project.organizerIds, ...member.project.userIds] : [];
            const channels = Array.from(
                new Set(
                    [...recipients.map((item) => item.userId), ...memberIds].filter(
                        (id) => id !== request.userId!,
                    ),
                ),
            )
                .slice(0, 100)
                .map(RealtimeChannels.user);
            if (channels.length) {
                await enqueueRealtimeEvent({
                    channels,
                    eventName: "client-comment-created-v1",
                    actorId: request.userId!,
                    aggregate: { type: "portal-comment", id: saved.id, version: realtimeVersion(saved) },
                    data: { comment: saved.toObject({ virtuals: true }) },
                    socketId: pusherSocketId(request.header("x-pusher-socket-id")),
                });
            }
            return saved;
        });
        request.responseModel = comment;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
