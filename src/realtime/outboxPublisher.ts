import { Counter, Gauge } from "@prometheus-io/client";
import mongoose from "mongoose";
import { OutboxEventQueries } from "../database/queries/outbox.js";
import { logger } from "../helpers/logger.js";
import { metricsRegistry } from "../helpers/metrics.js";
import { getEnvironment } from "../startup/environment.js";
import { getPusherClient } from "./pusherClient.js";

const published = new Counter({
    name: "jirello_realtime_events_published_total",
    help: "Realtime outbox events published to Pusher",
    registers: [metricsRegistry],
});
const failed = new Counter({
    name: "jirello_realtime_events_failed_total",
    help: "Realtime Pusher publication attempts that failed",
    registers: [metricsRegistry],
});
new Gauge({
    name: "jirello_realtime_outbox_pending",
    help: "Realtime events waiting for Pusher delivery",
    registers: [metricsRegistry],
    async collect() {
        this.set(
            mongoose.connection.readyState === 1
                ? await OutboxEventQueries.countOutboxEventsQuery({ status: "pending" })
                : 0,
        );
    },
});
new Gauge({
    name: "jirello_realtime_outbox_dead",
    help: "Realtime events in the dead-letter state",
    registers: [metricsRegistry],
    async collect() {
        this.set(
            mongoose.connection.readyState === 1
                ? await OutboxEventQueries.countOutboxEventsQuery({ status: "dead" })
                : 0,
        );
    },
});

async function claimEvent() {
    const staleLock = new Date(Date.now() - 60_000);
    const lockedBy = getEnvironment().instanceId;
    return OutboxEventQueries.claimOutboxEventQuery(
        {
            $or: [
                { status: "pending", availableAt: { $lte: new Date() } },
                { status: "processing", lockedAt: { $lte: staleLock } },
            ],
        },
        { $set: { status: "processing", lockedAt: new Date(), lockedBy }, $inc: { attempts: 1 } },
        { new: true, sort: { availableAt: 1 } },
    );
}

export async function publishOutboxBatch(limit = 25): Promise<number> {
    const pusher = getPusherClient();
    if (!pusher) return 0;
    let processed = 0;
    for (; processed < limit; processed += 1) {
        const event = await claimEvent();
        if (!event) break;
        try {
            const response = await pusher.trigger(event.channels, event.eventName, event.payload, {
                socket_id: event.socketId,
            });
            if (!response.ok) throw new Error(`Pusher returned HTTP ${response.status}.`);
            if (event.terminateUserId) {
                const termination = await pusher.terminateUserConnections(event.terminateUserId);
                if (!termination.ok)
                    throw new Error(`Pusher connection termination returned HTTP ${termination.status}.`);
            }
            await OutboxEventQueries.updateOutboxEventQuery(
                { eventId: event.eventId, status: "processing", lockedBy: event.lockedBy },
                {
                    $set: {
                        status: "delivered",
                        deliveredAt: new Date(),
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60_000),
                    },
                    $unset: { lockedAt: 1, lockedBy: 1, lastError: 1 },
                },
            );
            published.inc();
        } catch (error) {
            const dead = event.attempts >= 8;
            const delay = Math.min(2 ** event.attempts * 1_000, 15 * 60_000);
            await OutboxEventQueries.updateOutboxEventQuery(
                { eventId: event.eventId, status: "processing", lockedBy: event.lockedBy },
                {
                    $set: {
                        status: dead ? "dead" : "pending",
                        availableAt: new Date(Date.now() + delay),
                        lastError:
                            error instanceof Error ? error.message.slice(0, 500) : "Unknown Pusher error",
                    },
                    $unset: { lockedAt: 1, lockedBy: 1 },
                },
            );
            failed.inc();
            logger.error({ err: error, eventId: event.eventId, dead }, "Realtime event publication failed");
        }
    }
    return processed;
}

export function startOutboxPublisher(): () => void {
    let active = false;
    const publish = async () => {
        if (active) return;
        active = true;
        try {
            await publishOutboxBatch();
        } catch (error) {
            logger.error({ err: error }, "Realtime outbox worker failed");
        } finally {
            active = false;
        }
    };
    const timer = setInterval(publish, 1_000);
    timer.unref();
    void publish();
    return () => clearInterval(timer);
}
