import mongoose, { Model } from "mongoose";
import type { IClientPortal } from "./IClientPortal.js";
export type { IClientPortal } from "./IClientPortal.js";

const ClientPortalSchema = new mongoose.Schema<IClientPortal>(
    {
        communityId: { type: String, required: true },
        projectId: { type: String, required: true },
        enabled: { type: Boolean, required: true, default: false },
        name: { type: String, trim: true, maxlength: 150 },
        welcomeMessage: { type: String, maxlength: 2000 },
        logoUrl: { type: String, maxlength: 2048 },
        accentColor: { type: String },
        showProgress: { type: Boolean, default: true },
        showMilestones: { type: Boolean, default: true },
        showFinancials: { type: Boolean, default: false },
        publicEnabled: { type: Boolean, default: false },
        publicSlug: { type: String, trim: true, lowercase: true },
    },
    { timestamps: true },
);

ClientPortalSchema.index({ projectId: 1 }, { unique: true });
ClientPortalSchema.index({ publicSlug: 1 }, { unique: true, sparse: true });

export const ClientPortalModel: Model<IClientPortal> = mongoose.model<IClientPortal>(
    "ClientPortals",
    ClientPortalSchema,
);
