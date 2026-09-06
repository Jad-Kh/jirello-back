import mongoose, { type Model } from "mongoose";
import type { IMessageReport } from "./IMessageReport.js";
export type { MessageReportStatus, IMessageReport } from "./IMessageReport.js";

const MessageReportSchema = new mongoose.Schema<IMessageReport>(
    {
        messageId: { type: String, required: true },
        communityId: { type: String, required: true },
        projectId: String,
        reporterId: { type: String, required: true },
        reason: { type: String, enum: ["spam", "harassment", "inappropriate", "other"], required: true },
        details: { type: String, maxlength: 1000 },
        status: { type: String, enum: ["open", "reviewed", "dismissed", "actioned"], default: "open" },
        reviewedBy: String,
        reviewedAt: Date,
    },
    { timestamps: true },
);
MessageReportSchema.index({ messageId: 1, reporterId: 1 }, { unique: true });
MessageReportSchema.index({ communityId: 1, status: 1, createdAt: -1 });

export const MessageReportModel: Model<IMessageReport> = mongoose.model<IMessageReport>(
    "MessageReports",
    MessageReportSchema,
);
