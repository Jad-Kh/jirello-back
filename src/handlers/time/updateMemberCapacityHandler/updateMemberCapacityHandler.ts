import { MemberCapacityQueries } from "../../../database/queries/time.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateMemberCapacityRequest } from "./updateMemberCapacityRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId } from "../../../realtime/events.js";
import { communityAccess, isCommunityManager } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { TimeErrorResponses } from "../../../responses/errors/TimeErrorResponses.js";

export async function updateMemberCapacityHandler(
    request: IRequest<UpdateMemberCapacityRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await communityAccess(request.userId!, value.communityId, "users", [
            Permissions.EDIT_OWN,
            Permissions.EDIT_OTHER,
        ]);
        if (
            !context ||
            (request.params.userId !== request.userId! && !isCommunityManager(context, request.userId!))
        ) {
            response.status(403).json({ ...TimeErrorResponses.CAPACITY_UPDATE_ACCESS_DENIED });
            return;
        }
        const capacity = await runInTransaction(async () => {
            const updated = await MemberCapacityQueries.updateMemberCapacityQuery(
                { communityId: value.communityId, userId: request.params.userId },
                { $set: { ...value, userId: request.params.userId } },
                { new: true, upsert: true, setDefaultsOnInsert: true, session: getTransactionSession() },
            );
            if (!updated) throw new Error("Member capacity upsert did not return a document.");
            await enqueueRealtimeEvent({
                channels: [
                    RealtimeChannels.user(request.params.userId),
                    RealtimeChannels.community(value.communityId),
                ],
                eventName: "member-capacity-updated-v1",
                actorId: request.userId!,
                aggregate: {
                    type: "member-capacity",
                    id: updated.id,
                    version: updated.updatedAt?.getTime() ?? Date.now(),
                },
                data: { capacity: updated.toObject({ virtuals: true }) },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return updated;
        });
        request.responseModel = capacity;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
