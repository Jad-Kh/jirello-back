import { UserQueries } from "../../../database/queries/user.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateNotificationPreferencesRequest } from "./updateNotificationPreferencesRequest.js";
import { runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, realtimeVersion } from "../../../realtime/events.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";

export async function updateNotificationPreferencesHandler(
    request: IRequest<UpdateNotificationPreferencesRequest, "">,
    _response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const user = await runInTransaction(async () => {
            const updated = await UserQueries.updateNotificationPreferencesQuery(request.userId!, value);
            if (updated) {
                await enqueueRealtimeEvent({
                    channels: [RealtimeChannels.user(request.userId!)],
                    eventName: "notification-preferences-updated-v1",
                    actorId: request.userId!,
                    aggregate: {
                        type: "notification-preferences",
                        id: request.userId!,
                        version: realtimeVersion(updated),
                    },
                    data: { notifications: updated.notifications },
                });
            }
            return updated;
        });
        request.responseModel = user?.notifications;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
