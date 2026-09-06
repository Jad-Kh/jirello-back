import { randomUUID } from "node:crypto";
import { OutboxEventQueries } from "../database/queries/outbox.js";
import { getEnvironment } from "../startup/environment.js";

export type RealtimeAggregate = { type: string; id: string; version: number };
export type RealtimeEnvelope = {
    eventId: string;
    eventType: string;
    occurredAt: string;
    actorId?: string;
    aggregate: RealtimeAggregate;
    data: Record<string, unknown>;
};

export type EnqueueRealtimeEvent = {
    channels: string[];
    eventName: string;
    actorId?: string;
    aggregate: RealtimeAggregate;
    data: Record<string, unknown>;
    socketId?: string;
    terminateUserId?: string;
};

export async function enqueueRealtimeEvent(
    event: EnqueueRealtimeEvent,
): Promise<RealtimeEnvelope | undefined> {
    if (!/^[A-Za-z0-9_-]{1,200}$/.test(event.eventName)) throw new Error("Invalid Pusher event name.");
    if (event.channels.length < 1 || event.channels.length > 100)
        throw new Error("Invalid Pusher channel count.");
    const envelope: RealtimeEnvelope = {
        eventId: randomUUID(),
        eventType: event.eventName,
        occurredAt: new Date().toISOString(),
        actorId: event.actorId,
        aggregate: event.aggregate,
        data: event.data,
    };
    if (Buffer.byteLength(JSON.stringify(envelope), "utf8") >= 9_500) {
        throw new Error("Realtime event payload exceeds the safe Pusher size limit.");
    }
    if (!getEnvironment().pusher) return undefined;
    await OutboxEventQueries.createOutboxEventQuery({
        eventId: envelope.eventId,
        channels: event.channels,
        eventName: event.eventName,
        payload: envelope,
        socketId: event.socketId,
        terminateUserId: event.terminateUserId,
    });
    return envelope;
}

export function realtimeVersion(document: { updatedAt?: Date } | null | undefined): number {
    return document?.updatedAt?.getTime() ?? Date.now();
}

export function pusherSocketId(value: unknown): string | undefined {
    return typeof value === "string" && /^\d+\.\d+$/.test(value) ? value : undefined;
}

export function realtimeDocument<T>(document: T): unknown {
    const candidate = document as T & { toObject?: (options?: { virtuals?: boolean }) => unknown };
    return typeof candidate?.toObject === "function" ? candidate.toObject({ virtuals: true }) : document;
}
