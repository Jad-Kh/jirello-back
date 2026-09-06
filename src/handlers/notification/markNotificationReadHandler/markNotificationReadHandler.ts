import { NotificationQueries } from "../../../database/queries/notification.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, realtimeVersion } from "../../../realtime/events.js";
import { objectIdPattern } from "../../../services/notification/notificationService.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { NotificationErrorResponses } from "../../../responses/errors/NotificationErrorResponses.js";

export async function markNotificationReadHandler(
    request: ExpressRequest<{ id: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        if (!objectIdPattern.test(request.params.id)) {
            response.status(400).json({ ...NotificationErrorResponses.INVALID_NOTIFICATION_ID });
            return;
        }
        const notification = await runInTransaction(async () => {
            const updated = await NotificationQueries.updateNotificationQuery(
                { _id: request.params.id, recipientId: request.userId! },
                { $set: { readAt: new Date() } },
                { new: true, session: getTransactionSession() },
            );
            if (updated) {
                await enqueueRealtimeEvent({
                    channels: [RealtimeChannels.user(request.userId!)],
                    eventName: "notification-read-v1",
                    actorId: request.userId!,
                    aggregate: { type: "notification", id: updated.id, version: realtimeVersion(updated) },
                    data: { notificationId: updated.id, readAt: updated.readAt?.toISOString() },
                });
            }
            return updated;
        });
        if (!notification) {
            response.status(404).json({ ...NotificationErrorResponses.NOTIFICATION_NOT_FOUND });
            return;
        }
        request.responseModel = notification;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
