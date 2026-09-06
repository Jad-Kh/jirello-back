import mongoose, { type Model } from "mongoose";
import type { ICommunityInvitation } from "./ICommunityInvitation.js";
export type { InvitationStatus, ICommunityInvitation } from "./ICommunityInvitation.js";

const CommunityInvitationSchema = new mongoose.Schema<ICommunityInvitation>(
    {
        communityId: { type: String, required: true },
        invitedUserId: { type: String, required: true },
        invitedBy: { type: String, required: true },
        status: { type: String, enum: ["pending", "accepted", "declined", "expired"], default: "pending" },
        expiresAt: { type: Date, required: true },
        respondedAt: Date,
    },
    { timestamps: true },
);
CommunityInvitationSchema.index(
    { communityId: 1, invitedUserId: 1 },
    { unique: true, partialFilterExpression: { status: "pending" } },
);
CommunityInvitationSchema.index({ invitedUserId: 1, status: 1, createdAt: -1 });

export const CommunityInvitationModel: Model<ICommunityInvitation> = mongoose.model<ICommunityInvitation>(
    "CommunityInvitations",
    CommunityInvitationSchema,
);
