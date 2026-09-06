import mongoose, { Model } from "mongoose";
import type { ITimeEntry } from "./ITimeEntry.js";
export type { ITimeEntry } from "./ITimeEntry.js";

const TimeEntrySchema = new mongoose.Schema<ITimeEntry>(
    {
        communityId: { type: String, required: true },
        projectId: { type: String },
        taskId: { type: String },
        userId: { type: String, required: true },
        description: { type: String, maxlength: 2000 },
        startedAt: { type: Date, required: true },
        endedAt: { type: Date },
        durationMinutes: { type: Number, min: 0 },
        billable: { type: Boolean, required: true, default: false },
        billingRateCents: { type: Number, min: 0 },
        costRateCents: { type: Number, min: 0 },
        currency: {
            type: String,
            required: true,
            uppercase: true,
            minlength: 3,
            maxlength: 3,
            default: "USD",
        },
        status: { type: String, enum: ["draft", "submitted", "approved", "rejected"], default: "draft" },
        reviewerId: { type: String },
        reviewedAt: { type: Date },
        rejectionReason: { type: String, maxlength: 1000 },
        version: { type: Number, required: true, default: 1 },
    },
    { timestamps: true },
);

TimeEntrySchema.index({ userId: 1, startedAt: -1 });
TimeEntrySchema.index({ communityId: 1, userId: 1, startedAt: -1, _id: -1 });
TimeEntrySchema.index({ communityId: 1, status: 1, startedAt: -1 });
TimeEntrySchema.index({ projectId: 1, startedAt: -1 });
TimeEntrySchema.index({ userId: 1, endedAt: 1 });
TimeEntrySchema.index({ userId: 1 }, { unique: true, partialFilterExpression: { endedAt: null } });

export const TimeEntryModel: Model<ITimeEntry> = mongoose.model<ITimeEntry>("TimeEntries", TimeEntrySchema);
