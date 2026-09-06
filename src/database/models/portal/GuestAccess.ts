import mongoose, { Model } from "mongoose";
import type { IGuestAccess } from "./IGuestAccess.js";
export type { IGuestAccess } from "./IGuestAccess.js";

const GuestAccessSchema = new mongoose.Schema<IGuestAccess>(
    {
        communityId: { type: String, required: true },
        projectId: { type: String, required: true },
        userId: { type: String, required: true },
        invitedBy: { type: String, required: true },
        role: { type: String, enum: ["viewer", "commenter", "approver"], required: true, default: "viewer" },
        status: { type: String, enum: ["active", "revoked"], required: true, default: "active" },
        expiresAt: { type: Date },
        revokedAt: { type: Date },
    },
    { timestamps: true },
);

GuestAccessSchema.index({ projectId: 1, userId: 1 }, { unique: true });
GuestAccessSchema.index({ userId: 1, status: 1, expiresAt: 1 });

export const GuestAccessModel: Model<IGuestAccess> = mongoose.model<IGuestAccess>(
    "GuestAccess",
    GuestAccessSchema,
);
