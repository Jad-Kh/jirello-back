import mongoose, { Model } from "mongoose";
import type { ICalendarEvent } from "./ICalendarEvent.js";
export type { CalendarEventKind, ICalendarEvent } from "./ICalendarEvent.js";

const calendarAttendeeValidationScheme = new mongoose.Schema(
    {
        userId: { type: String },
        email: { type: String, lowercase: true, trim: true },
        name: { type: String, trim: true },
        optional: { type: Boolean, required: true, default: false },
        response: {
            type: String,
            enum: ["pending", "accepted", "declined", "tentative"],
            default: "pending",
        },
    },
    { _id: false },
);

const CalendarEventSchema = new mongoose.Schema<ICalendarEvent>(
    {
        ownerId: { type: String, required: true },
        calendarId: { type: String },
        organizerId: { type: String, required: true },
        communityId: { type: String },
        projectId: { type: String },
        taskId: { type: String },
        seriesId: { type: String },
        originalStartAt: { type: Date },
        kind: {
            type: String,
            enum: ["event", "meeting", "focus", "reminder", "out-of-office", "appointment", "deadline"],
            default: "event",
        },
        title: { type: String, required: true, trim: true, maxlength: 300 },
        description: { type: String, maxlength: 10000 },
        startAt: { type: Date, required: true },
        endAt: { type: Date, required: true },
        allDay: { type: Boolean, required: true, default: false },
        timezone: { type: String, required: true, default: "UTC" },
        location: { type: String, maxlength: 1000 },
        conferenceUrl: { type: String, maxlength: 2048 },
        color: { type: String },
        visibility: {
            type: String,
            enum: ["private", "attendees", "project", "community"],
            default: "private",
        },
        availability: { type: String, enum: ["busy", "free"], default: "busy" },
        status: { type: String, enum: ["confirmed", "tentative", "cancelled"], default: "confirmed" },
        attendees: { type: [calendarAttendeeValidationScheme], default: [] },
        reminders: {
            type: [
                new mongoose.Schema(
                    {
                        minutesBefore: { type: Number, required: true, min: 0, max: 525600 },
                        method: { type: String, enum: ["notification", "email"], required: true },
                    },
                    { _id: false },
                ),
            ],
            default: [],
        },
        recurrence: {
            frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"] },
            interval: { type: Number, min: 1, max: 365, default: 1 },
            byWeekday: { type: [Number], default: [] },
            until: { type: Date },
            count: { type: Number, min: 1, max: 1000 },
            excludedDates: { type: [Date], default: [] },
        },
        version: { type: Number, required: true, default: 1 },
    },
    { timestamps: true },
);

CalendarEventSchema.index({ ownerId: 1, startAt: 1, endAt: 1 });
CalendarEventSchema.index({ calendarId: 1, startAt: 1 });
CalendarEventSchema.index({ "attendees.userId": 1, startAt: 1, endAt: 1 });
CalendarEventSchema.index({ communityId: 1, startAt: 1 });
CalendarEventSchema.index({ projectId: 1, startAt: 1 });
CalendarEventSchema.index({ taskId: 1 });
CalendarEventSchema.index({ seriesId: 1, originalStartAt: 1 }, { unique: true, sparse: true });

export const CalendarEventModel: Model<ICalendarEvent> = mongoose.model<ICalendarEvent>(
    "CalendarEvents",
    CalendarEventSchema,
);
