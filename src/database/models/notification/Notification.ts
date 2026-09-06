import mongoose, { type Model } from "mongoose";
import type { INotification } from "./INotification.js";
export type { INotification } from "./INotification.js";

const NotificationSchema = new mongoose.Schema<INotification>(
    {
        recipientId: { type: String, required: true, index: true },
        type: { type: String, required: true },
        title: { type: String, required: true, maxlength: 160 },
        body: { type: String, required: true, maxlength: 500 },
        actorId: String,
        communityId: String,
        projectId: String,
        conversationId: String,
        resourceType: String,
        resourceId: String,
        readAt: Date,
        dedupeKey: { type: String, unique: true, sparse: true },
    },
    { timestamps: true },
);
NotificationSchema.index({ recipientId: 1, createdAt: -1, _id: -1 });
NotificationSchema.index({ recipientId: 1, readAt: 1 });

export const NotificationModel: Model<INotification> = mongoose.model<INotification>(
    "Notifications",
    NotificationSchema,
);
