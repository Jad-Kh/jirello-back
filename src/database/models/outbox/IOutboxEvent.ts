export type OutboxStatus = "pending" | "processing" | "delivered" | "dead";

export type IOutboxEvent = {
    eventId: string;
    channels: string[];
    eventName: string;
    payload: Record<string, unknown>;
    socketId?: string;
    terminateUserId?: string;
    status: OutboxStatus;
    attempts: number;
    availableAt: Date;
    lockedAt?: Date;
    lockedBy?: string;
    deliveredAt?: Date;
    expiresAt?: Date;
    lastError?: string;
};
