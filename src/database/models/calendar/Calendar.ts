import mongoose, { Model } from "mongoose";
import type { ICalendar } from "./ICalendar.js";
export type { ICalendar } from "./ICalendar.js";

const CalendarSchema = new mongoose.Schema<ICalendar>(
    {
        ownerId: { type: String, required: true },
        communityId: { type: String },
        projectId: { type: String },
        name: { type: String, required: true, trim: true, maxlength: 120 },
        color: { type: String, required: true, default: "#3b82f6" },
        timezone: { type: String, required: true, default: "UTC" },
        visibility: { type: String, enum: ["private", "members"], default: "private" },
        isDefault: { type: Boolean, required: true, default: false },
        archivedAt: { type: Date },
        version: { type: Number, required: true, default: 1 },
    },
    { timestamps: true },
);

CalendarSchema.index({ ownerId: 1, communityId: 1, projectId: 1, name: 1 }, { unique: true });
CalendarSchema.index({ communityId: 1, projectId: 1, visibility: 1, archivedAt: 1 });

export const CalendarModel: Model<ICalendar> = mongoose.model<ICalendar>("Calendars", CalendarSchema);
