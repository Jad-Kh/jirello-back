import mongoose, { Model } from "mongoose";
import type { IMemberCapacity } from "./IMemberCapacity.js";
export type { IMemberCapacity } from "./IMemberCapacity.js";

const MemberCapacitySchema = new mongoose.Schema<IMemberCapacity>(
    {
        communityId: { type: String, required: true },
        userId: { type: String, required: true },
        timezone: { type: String, required: true, default: "UTC" },
        weeklyMinutes: { type: Number, required: true, min: 0, max: 10080, default: 2400 },
        workingDays: { type: [Number], required: true, default: [1, 2, 3, 4, 5] },
        dailyMinutes: { type: Number, required: true, min: 0, max: 1440, default: 480 },
        overrides: {
            type: [
                new mongoose.Schema(
                    {
                        date: { type: String, required: true },
                        availableMinutes: { type: Number, required: true, min: 0, max: 1440 },
                        note: { type: String, maxlength: 500 },
                    },
                    { _id: false },
                ),
            ],
            default: [],
        },
    },
    { timestamps: true },
);

MemberCapacitySchema.index({ communityId: 1, userId: 1 }, { unique: true });

export const MemberCapacityModel: Model<IMemberCapacity> = mongoose.model<IMemberCapacity>(
    "MemberCapacities",
    MemberCapacitySchema,
);
