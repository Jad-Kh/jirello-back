import mongoose, { type Model } from "mongoose";
import type { ICollaborationMessage } from "./ICollaborationMessage.js";
export type { CollaborationKind, ICollaborationMessage } from "./ICollaborationMessage.js";

const CollaborationMessageSchema = new mongoose.Schema<ICollaborationMessage>(
    {
        kind: { type: String, enum: ["chat", "comment"], required: true },
        scopeType: { type: String, enum: ["community", "project"], required: true },
        scopeId: { type: String, required: true },
        communityId: { type: String, required: true },
        projectId: String,
        authorId: { type: String, required: true },
        body: { type: String, required: true, maxlength: 5000 },
        parentId: String,
        mentionedUserIds: { type: [String], default: [] },
        version: { type: Number, default: 1, required: true },
        editedAt: Date,
        deletedAt: Date,
    },
    { timestamps: true },
);
CollaborationMessageSchema.index({ scopeType: 1, scopeId: 1, kind: 1, createdAt: -1, _id: -1 });
CollaborationMessageSchema.index({ parentId: 1, createdAt: 1 });

export const CollaborationMessageModel: Model<ICollaborationMessage> = mongoose.model<ICollaborationMessage>(
    "CollaborationMessages",
    CollaborationMessageSchema,
);
