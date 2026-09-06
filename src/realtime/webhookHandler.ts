import type { RequestHandler } from "express";
import { logger } from "../helpers/logger.js";
import { getPusherClient } from "./pusherClient.js";

export const pusherWebhookHandler: RequestHandler = (request, response, next): void => {
    try {
        const pusher = getPusherClient();
        if (!pusher || !Buffer.isBuffer(request.body)) {
            response.status(503).json({ code: 503, message: "Realtime service is unavailable." });
            return;
        }
        const webhook = pusher.webhook({ headers: request.headers, rawBody: request.body.toString("utf8") });
        if (!webhook.isValid() || Math.abs(Date.now() - webhook.getTime().getTime()) > 5 * 60_000) {
            response.status(401).json({ code: 401, message: "Invalid Pusher webhook signature." });
            return;
        }
        for (const event of webhook.getEvents()) {
            logger.info(
                { pusherEvent: event.name, channel: event.channel, socketId: event.socket_id },
                "Verified Pusher webhook",
            );
        }
        response.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
