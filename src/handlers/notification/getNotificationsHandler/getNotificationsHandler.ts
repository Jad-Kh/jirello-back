import { NotificationQueries } from "../../../database/queries/notification.js";

import { decodeDateCursor, encodeDateCursor } from "../../../helpers/cursorPagination.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { NotificationErrorResponses } from "../../../responses/errors/NotificationErrorResponses.js";

export async function getNotificationsHandler(
    request: ExpressRequest,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const limit = Math.min(Math.max(Number(request.query.limit) || 30, 1), 100);
        const encodedCursor = request.query.cursor ? String(request.query.cursor) : undefined;
        const cursor = encodedCursor ? decodeDateCursor(encodedCursor) : null;
        const before = request.query.before ? new Date(String(request.query.before)) : undefined;
        if ((encodedCursor && !cursor) || (before && Number.isNaN(before.getTime()))) {
            response.status(400).json({ ...NotificationErrorResponses.INVALID_NOTIFICATION_CURSOR });
            return;
        }
        const cursorDate = cursor ? new Date(cursor.createdAt) : undefined;
        const notifications = await NotificationQueries.getNotificationsQuery({
            recipientId: request.userId!,
            ...(cursorDate
                ? {
                      $or: [
                          { createdAt: { $lt: cursorDate } },
                          { createdAt: cursorDate, _id: { $lt: cursor!.id } },
                      ],
                  }
                : before
                  ? { createdAt: { $lt: before } }
                  : {}),
        })
            .select("-dedupeKey")
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit + 1);
        const hasMore = notifications.length > limit;
        const page = hasMore ? notifications.slice(0, limit) : notifications;
        const last = page.at(-1);
        const nextCursor = hasMore && last?.createdAt ? encodeDateCursor(last.createdAt, last.id) : null;
        const unreadCount = await NotificationQueries.countNotificationsQuery({
            recipientId: request.userId!,
            readAt: { $exists: false },
        });
        request.responseModel = { notifications: page, unreadCount, nextCursor };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
