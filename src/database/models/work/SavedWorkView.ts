import mongoose, { Model } from "mongoose";
import type { ISavedWorkView } from "./ISavedWorkView.js";
export type { ISavedWorkView } from "./ISavedWorkView.js";

const SavedWorkViewSchema = new mongoose.Schema<ISavedWorkView>(
    {
        communityId: { type: String, required: true },
        projectId: { type: String },
        ownerId: { type: String, required: true },
        name: { type: String, required: true, trim: true },
        visibility: { type: String, enum: ["private", "project", "community"], default: "private" },
        layout: { type: String, enum: ["board", "list", "table", "calendar", "timeline"], required: true },
        filters: { type: mongoose.Schema.Types.Mixed, default: {} },
        sort: {
            type: [
                {
                    field: { type: String, required: true },
                    direction: { type: String, enum: ["asc", "desc"] },
                },
            ],
            default: [],
        },
        groupBy: { type: String },
    },
    { timestamps: true },
);

SavedWorkViewSchema.index({ ownerId: 1, communityId: 1, name: 1 }, { unique: true });
SavedWorkViewSchema.index({ communityId: 1, projectId: 1, visibility: 1 });

export const SavedWorkViewModel: Model<ISavedWorkView> = mongoose.model<ISavedWorkView>(
    "SavedWorkViews",
    SavedWorkViewSchema,
);
