import { ICommon } from "../ICommon.js";

export type ICalendarReminderDelivery = ICommon & {
    eventId: string;
    occurrenceAt: Date;
    recipient: string;
    method: "notification" | "email";
    minutesBefore: number;
    status: "pending" | "delivered" | "failed";
    attempts: number;
    lastError?: string;
    deliveredAt?: Date;
};
