import mongoose, { type Model } from "mongoose";
import type { IOutboxEvent } from "./IOutboxEvent.js";
export type { OutboxStatus, IOutboxEvent } from "./IOutboxEvent.js";

const OutboxEventSchema = new mongoose.Schema<IOutboxEvent>(
    {
        eventId: { type: String, required: true, unique: true },
        channels: { type: [String], required: true },
        eventName: { type: String, required: true },
        payload: { type: mongoose.Schema.Types.Mixed, required: true },
        socketId: String,
        terminateUserId: String,
        status: { type: String, enum: ["pending", "processing", "delivered", "dead"], default: "pending" },
        attempts: { type: Number, default: 0 },
        availableAt: { type: Date, default: Date.now },
        lockedAt: Date,
        lockedBy: String,
        deliveredAt: Date,
        expiresAt: Date,
        lastError: String,
    },
    { timestamps: true },
);

OutboxEventSchema.index({ status: 1, availableAt: 1 });
OutboxEventSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OutboxEventModel: Model<IOutboxEvent> = mongoose.model<IOutboxEvent>(
    "OutboxEvents",
    OutboxEventSchema,
);
