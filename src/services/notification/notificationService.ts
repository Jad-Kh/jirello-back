import type { INotification } from "../../database/models/notification/INotification.js";
import { NotificationQueries } from "../../database/queries/notification.js";
import { UserQueries } from "../../database/queries/user.js";
import { runInTransaction } from "../../database/transaction.js";
import { RealtimeChannels } from "../../realtime/channels.js";
import { enqueueRealtimeEvent, realtimeVersion } from "../../realtime/events.js";

export const objectIdPattern = /^[a-f\d]{24}$/i;

export async function createNotification(values: INotification) {
    return runInTransaction(async () => {
        const notification = await NotificationQueries.createNotificationQuery(values);
        const recipient = await UserQueries.getUserByIdQuery(values.recipientId);
        const muted =
            recipient?.notifications?.muteAll ||
            (values.communityId &&
                recipient?.notifications?.mutedCommunityIds?.includes(values.communityId)) ||
            (values.conversationId &&
                recipient?.notifications?.mutedChatIds?.includes(values.conversationId));

        if (!muted) {
            const realtimeNotification = notification.toObject({ virtuals: true });
            delete realtimeNotification.dedupeKey;
            await enqueueRealtimeEvent({
                channels: [RealtimeChannels.user(values.recipientId)],
                eventName: "notification-created-v1",
                actorId: values.actorId,
                aggregate: {
                    type: "notification",
                    id: notification.id,
                    version: realtimeVersion(notification),
                },
                data: { notification: realtimeNotification },
            });
        }

        return notification;
    });
}
