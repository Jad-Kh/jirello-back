import mongoose, { Model } from "mongoose";
import type { IWorkConfiguration } from "./IWorkConfiguration.js";
export type { WorkFieldType, IWorkConfiguration } from "./IWorkConfiguration.js";

const WorkConfigurationSchema = new mongoose.Schema<IWorkConfiguration>(
    {
        communityId: { type: String, required: true },
        projectId: { type: String },
        key: { type: String, required: true, trim: true, lowercase: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, maxlength: 2000 },
        color: { type: String },
        icon: { type: String },
        statuses: {
            type: [
                new mongoose.Schema(
                    {
                        key: { type: String, required: true, lowercase: true, trim: true },
                        name: { type: String, required: true, trim: true },
                        category: { type: String, enum: ["todo", "in-progress", "done"], required: true },
                        position: { type: Number, required: true, min: 0 },
                    },
                    { _id: false },
                ),
            ],
            required: true,
        },
        fields: {
            type: [
                new mongoose.Schema(
                    {
                        key: { type: String, required: true, lowercase: true, trim: true },
                        label: { type: String, required: true, trim: true },
                        type: {
                            type: String,
                            enum: [
                                "text",
                                "number",
                                "boolean",
                                "date",
                                "currency",
                                "select",
                                "multi-select",
                                "user",
                            ],
                            required: true,
                        },
                        required: { type: Boolean, required: true, default: false },
                        options: { type: [String], default: [] },
                        defaultValue: { type: mongoose.Schema.Types.Mixed },
                    },
                    { _id: false },
                ),
            ],
            default: [],
        },
        transitions: {
            type: [
                new mongoose.Schema(
                    { from: { type: String, required: true }, to: { type: String, required: true } },
                    { _id: false },
                ),
            ],
            default: [],
        },
        isDefault: { type: Boolean, required: true, default: false },
        archivedAt: { type: Date },
        version: { type: Number, required: true, default: 1 },
    },
    { timestamps: true },
);

WorkConfigurationSchema.index({ communityId: 1, projectId: 1, key: 1 }, { unique: true });
WorkConfigurationSchema.index({ communityId: 1, archivedAt: 1, projectId: -1, name: 1 });

export const WorkConfigurationModel: Model<IWorkConfiguration> = mongoose.model<IWorkConfiguration>(
    "WorkConfigurations",
    WorkConfigurationSchema,
);
