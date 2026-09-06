import { DeliverableQueries, GuestAccessQueries } from "../../../database/queries/portal.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateDeliverableRequest } from "./updateDeliverableRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { projectAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function updateDeliverableHandler(
    request: IRequest<UpdateDeliverableRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const current = await DeliverableQueries.getDeliverableByIdQuery(request.params.id);
        const context = current
            ? await projectAccess(request.userId!, current.projectId, "tasks", [
                  Permissions.EDIT_OWN,
                  Permissions.EDIT_OTHER,
              ])
            : undefined;
        if (!current || !context) {
            response.status(403).json({ ...PortalErrorResponses.DELIVERABLE_UPDATE_ACCESS_DENIED });
            return;
        }
        const { version, submit, ...updates } = value;
        const deliverable = await runInTransaction(async () => {
            const updated = await DeliverableQueries.updateDeliverableQuery(
                { _id: current.id, version },
                {
                    $set: {
                        ...updates,
                        ...(submit ? { status: "submitted", submittedAt: new Date() } : {}),
                    },
                    ...(submit ? { $unset: { decision: 1 } } : {}),
                    $inc: { version: 1 },
                },
                { new: true, session: getTransactionSession() },
            );
            if (!updated) return null;
            const guests = submit
                ? await GuestAccessQueries.getGuestAccessesQuery({
                      projectId: current.projectId,
                      status: "active",
                  })
                : [];
            const channels = [
                RealtimeChannels.project(current.projectId),
                ...guests.map((guest) => RealtimeChannels.user(guest.userId)),
            ].slice(0, 100);
            await enqueueRealtimeEvent({
                channels,
                eventName: submit ? "deliverable-submitted-v1" : "deliverable-updated-v1",
                actorId: request.userId!,
                aggregate: { type: "deliverable", id: updated.id, version: updated.version },
                data: { deliverable: updated.toObject({ virtuals: true }) },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return updated;
        });
        if (!deliverable) {
            response
                .status(409)
                .json({ ...PortalErrorResponses.DELIVERABLE_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = deliverable;
        request.successResponse = {
            code: 200,
            message: submit ? "Deliverable submitted." : "Deliverable updated.",
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
