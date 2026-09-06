import mongoose, { Model } from "mongoose";
import type { IPortalComment } from "./IPortalComment.js";
export type { IPortalComment } from "./IPortalComment.js";

const PortalCommentSchema = new mongoose.Schema<IPortalComment>(
    {
        communityId: { type: String, required: true },
        projectId: { type: String, required: true },
        deliverableId: { type: String },
        taskId: { type: String },
        authorId: { type: String, required: true },
        body: { type: String, required: true, maxlength: 5000 },
        annotation: {
            assetUrl: { type: String },
            page: { type: Number, min: 1 },
            x: { type: Number, min: 0, max: 1 },
            y: { type: Number, min: 0, max: 1 },
        },
        editedAt: { type: Date },
    },
    { timestamps: true },
);

PortalCommentSchema.index({ projectId: 1, createdAt: -1 });
PortalCommentSchema.index({ deliverableId: 1, createdAt: 1 });

export const PortalCommentModel: Model<IPortalComment> = mongoose.model<IPortalComment>(
    "PortalComments",
    PortalCommentSchema,
);
