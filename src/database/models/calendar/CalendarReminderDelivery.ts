import mongoose, { Model } from "mongoose";
import type { ICalendarReminderDelivery } from "./ICalendarReminderDelivery.js";
export type { ICalendarReminderDelivery } from "./ICalendarReminderDelivery.js";

const CalendarReminderDeliverySchema = new mongoose.Schema<ICalendarReminderDelivery>(
    {
        eventId: { type: String, required: true },
        occurrenceAt: { type: Date, required: true },
        recipient: { type: String, required: true },
        method: { type: String, enum: ["notification", "email"], required: true },
        minutesBefore: { type: Number, required: true },
        status: { type: String, enum: ["pending", "delivered", "failed"], default: "pending" },
        attempts: { type: Number, default: 0 },
        lastError: { type: String },
        deliveredAt: { type: Date },
    },
    { timestamps: true },
);

CalendarReminderDeliverySchema.index(
    { eventId: 1, occurrenceAt: 1, recipient: 1, method: 1, minutesBefore: 1 },
    { unique: true },
);
CalendarReminderDeliverySchema.index({ status: 1, createdAt: 1 });

export const CalendarReminderDeliveryModel: Model<ICalendarReminderDelivery> =
    mongoose.model<ICalendarReminderDelivery>("CalendarReminderDeliveries", CalendarReminderDeliverySchema);
