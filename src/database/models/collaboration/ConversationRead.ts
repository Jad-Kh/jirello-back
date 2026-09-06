import mongoose, { type Model } from "mongoose";
import type { IConversationRead } from "./IConversationRead.js";
export type { IConversationRead } from "./IConversationRead.js";

const ConversationReadSchema = new mongoose.Schema<IConversationRead>(
    {
        userId: { type: String, required: true },
        scopeType: { type: String, enum: ["community", "project"], required: true },
        scopeId: { type: String, required: true },
        lastReadAt: { type: Date, required: true },
    },
    { timestamps: true },
);
ConversationReadSchema.index({ userId: 1, scopeType: 1, scopeId: 1 }, { unique: true });

export const ConversationReadModel: Model<IConversationRead> = mongoose.model<IConversationRead>(
    "ConversationReads",
    ConversationReadSchema,
);
