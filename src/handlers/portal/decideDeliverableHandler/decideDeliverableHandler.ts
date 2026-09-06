import { DeliverableQueries } from "../../../database/queries/portal.js";
import type { IRequest } from "../../../helpers/api.js";
import type { DecideDeliverableRequest } from "./decideDeliverableRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import { activeGuest } from "../../../services/portal/portalService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function decideDeliverableHandler(
    request: IRequest<DecideDeliverableRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await DeliverableQueries.getDeliverableByIdQuery(request.params.id);
        const access = current ? await activeGuest(request.userId!, current.projectId) : undefined;
        if (!current || !access || access.role !== "approver" || current.status !== "submitted") {
            response.status(403).json({ ...PortalErrorResponses.DELIVERABLE_APPROVAL_ACCESS_DENIED });
            return;
        }
        const deliverable = await runInTransaction(async () => {
            const updated = await DeliverableQueries.updateDeliverableQuery(
                { _id: current.id, version: value.version, status: "submitted" },
                {
                    $set: {
                        status: value.decision,
                        decision: { actorId: request.userId!, decidedAt: new Date(), note: value.note },
                    },
                    $inc: { version: 1 },
                },
                { new: true, session: getTransactionSession() },
            );
            if (updated) {
                await createNotification({
                    recipientId: current.createdBy,
                    actorId: request.userId!,
                    communityId: current.communityId,
                    projectId: current.projectId,
                    resourceType: "deliverable",
                    resourceId: current.id,
                    type: "deliverable-decision",
                    title: value.decision === "approved" ? "Deliverable approved" : "Changes requested",
                    body: `${current.title} was ${value.decision === "approved" ? "approved" : "returned for changes"}.`,
                });
                await enqueueRealtimeEvent({
                    channels: [
                        RealtimeChannels.user(current.createdBy),
                        RealtimeChannels.project(current.projectId),
                    ],
                    eventName: "deliverable-decision-v1",
                    actorId: request.userId!,
                    aggregate: { type: "deliverable", id: updated.id, version: updated.version },
                    data: { deliverable: updated.toObject({ virtuals: true }) },
                    socketId: pusherSocketId(request.header("x-pusher-socket-id")),
                });
            }
            return updated;
        });
        if (!deliverable) {
            response
                .status(409)
                .json({ ...PortalErrorResponses.DELIVERABLE_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = deliverable;
        request.successResponse = { code: 200, message: `Deliverable ${value.decision}.` };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
