import mongoose, { Model } from "mongoose";
import type { IWorkTemplate } from "./IWorkTemplate.js";
export type { IWorkTemplate } from "./IWorkTemplate.js";

const WorkTemplateSchema = new mongoose.Schema<IWorkTemplate>(
    {
        communityId: { type: String, required: true },
        projectId: { type: String },
        name: { type: String, required: true, trim: true },
        description: { type: String, maxlength: 2000 },
        createdBy: { type: String, required: true },
        typeKey: { type: String, required: true, trim: true, lowercase: true },
        defaults: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
    },
    { timestamps: true },
);

WorkTemplateSchema.index({ communityId: 1, projectId: 1, name: 1 }, { unique: true });

export const WorkTemplateModel: Model<IWorkTemplate> = mongoose.model<IWorkTemplate>(
    "WorkTemplates",
    WorkTemplateSchema,
);
