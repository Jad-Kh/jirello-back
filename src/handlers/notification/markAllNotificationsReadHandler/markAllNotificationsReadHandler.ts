import { NotificationQueries } from "../../../database/queries/notification.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";

export async function markAllNotificationsReadHandler(
    request: ExpressRequest,
    _response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const readAt = new Date();
        await runInTransaction(async () => {
            await NotificationQueries.updateNotificationsQuery(
                { recipientId: request.userId!, readAt: { $exists: false } },
                { $set: { readAt } },
                { session: getTransactionSession() },
            );
            await enqueueRealtimeEvent({
                channels: [RealtimeChannels.user(request.userId!)],
                eventName: "notifications-read-all-v1",
                actorId: request.userId!,
                aggregate: { type: "user-notifications", id: request.userId!, version: readAt.getTime() },
                data: { readAt: readAt.toISOString() },
            });
        });
        request.responseModel = { readAt };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
