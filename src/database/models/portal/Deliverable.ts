import mongoose, { Model } from "mongoose";
import type { IDeliverable } from "./IDeliverable.js";
export type { IDeliverable } from "./IDeliverable.js";

const DeliverableSchema = new mongoose.Schema<IDeliverable>(
    {
        communityId: { type: String, required: true },
        projectId: { type: String, required: true },
        taskId: { type: String },
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: { type: String, maxlength: 5000 },
        createdBy: { type: String, required: true },
        dueAt: { type: Date },
        submittedAt: { type: Date },
        status: {
            type: String,
            enum: ["draft", "submitted", "approved", "changes-requested"],
            default: "draft",
        },
        version: { type: Number, required: true, default: 1 },
        decision: {
            actorId: { type: String },
            decidedAt: { type: Date },
            note: { type: String, maxlength: 2000 },
        },
        assets: {
            type: [
                new mongoose.Schema(
                    {
                        url: { type: String, required: true },
                        name: { type: String, required: true },
                        mimeType: { type: String },
                        revision: { type: Number, required: true, min: 1 },
                    },
                    { _id: false },
                ),
            ],
            default: [],
        },
    },
    { timestamps: true },
);

DeliverableSchema.index({ projectId: 1, status: 1, createdAt: -1 });
DeliverableSchema.index({ taskId: 1 });

export const DeliverableModel: Model<IDeliverable> = mongoose.model<IDeliverable>(
    "Deliverables",
    DeliverableSchema,
);
