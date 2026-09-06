import { CalendarEventQueries, CalendarReminderDeliveryQueries } from "../../database/queries/calendar.js";
import { UserQueries } from "../../database/queries/user.js";
import { sendTransactionalEmail } from "../../helpers/mailer.js";
import { expandCalendarEvent } from "../../services/calendar/recurrence.js";
import { createNotification } from "../../services/notification/notificationService.js";

const lookAheadMs = 366 * 86_400_000;

export async function publishCalendarReminders(now = new Date()): Promise<number> {
    const deliveryWindowStart = new Date(now.getTime() - 90_000);
    const deliveryWindowEnd = new Date(now.getTime() + 90_000);
    const occurrenceHorizon = new Date(now.getTime() + lookAheadMs);
    const events = await CalendarEventQueries.getCalendarEventsQuery({
        _seed: { $exists: false },
        status: { $ne: "cancelled" },
        reminders: { $elemMatch: { minutesBefore: { $gte: 0 } } },
        startAt: { $lte: occurrenceHorizon },
        $or: [
            { endAt: { $gte: now } },
            { "recurrence.until": { $gte: now } },
            { "recurrence.count": { $exists: true } },
            { "recurrence.frequency": { $exists: true }, "recurrence.until": { $exists: false } },
        ],
    }).limit(1000);
    let delivered = 0;
    for (const event of events) {
        const maximumReminder = Math.max(...event.reminders.map((reminder) => reminder.minutesBefore), 0);
        const occurrences = expandCalendarEvent(
            event,
            deliveryWindowStart,
            new Date(deliveryWindowEnd.getTime() + maximumReminder * 60_000),
            500,
        );
        for (const occurrence of occurrences) {
            for (const reminder of event.reminders) {
                const runAt = new Date(occurrence.startAt.getTime() - reminder.minutesBefore * 60_000);
                if (runAt < deliveryWindowStart || runAt > deliveryWindowEnd) continue;
                const recipients: Array<{ userId?: string; email?: string }> = [
                    { userId: event.ownerId, email: undefined },
                    ...event.attendees.filter((attendee) => attendee.response !== "declined"),
                ];
                for (const recipient of recipients) {
                    const user = recipient.userId
                        ? await UserQueries.getUserByIdQuery(recipient.userId)
                        : undefined;
                    const destination =
                        reminder.method === "email"
                            ? (recipient.email ?? user?.profile.email)
                            : recipient.userId;
                    if (!destination) continue;
                    let delivery;
                    try {
                        delivery = await CalendarReminderDeliveryQueries.createCalendarReminderDeliveryQuery({
                            eventId: event.id,
                            occurrenceAt: occurrence.startAt,
                            recipient: destination,
                            method: reminder.method,
                            minutesBefore: reminder.minutesBefore,
                        });
                    } catch (error) {
                        if ((error as { code?: number }).code === 11000) {
                            delivery = await CalendarReminderDeliveryQueries.getCalendarReminderDeliveryQuery(
                                {
                                    eventId: event.id,
                                    occurrenceAt: occurrence.startAt,
                                    recipient: destination,
                                    method: reminder.method,
                                    minutesBefore: reminder.minutesBefore,
                                    status: "failed",
                                    attempts: { $lt: 5 },
                                },
                            );
                            if (!delivery) continue;
                        } else {
                            throw error;
                        }
                    }
                    try {
                        if (reminder.method === "notification" && recipient.userId) {
                            try {
                                await createNotification({
                                    recipientId: recipient.userId,
                                    actorId: event.organizerId,
                                    communityId: event.communityId,
                                    projectId: event.projectId,
                                    resourceType: "calendar-event",
                                    resourceId: event.id,
                                    type: "calendar-reminder",
                                    title: "Calendar reminder",
                                    body: `${event.title} starts at ${occurrence.startAt.toISOString()}.`,
                                    dedupeKey: `calendar:${event.id}:${occurrence.startAt.toISOString()}:${recipient.userId}:${reminder.minutesBefore}`,
                                });
                            } catch (error) {
                                if ((error as { code?: number }).code !== 11000) throw error;
                            }
                        } else {
                            const sent = await sendTransactionalEmail(
                                destination,
                                `Reminder: ${event.title}`,
                                `${event.title} starts at ${occurrence.startAt.toISOString()} (${event.timezone}).${event.location ? `\nLocation: ${event.location}` : ""}${event.conferenceUrl ? `\nJoin: ${event.conferenceUrl}` : ""}`,
                                {
                                    messageId: `<calendar-${event.id}-${occurrence.startAt.getTime()}-${reminder.minutesBefore}@jirello>`,
                                },
                            );
                            if (!sent)
                                throw new Error("SMTP is not configured for calendar email reminders.");
                        }
                        await CalendarReminderDeliveryQueries.updateCalendarReminderDeliveryQuery(
                            delivery.id,
                            {
                                $set: { status: "delivered", deliveredAt: new Date() },
                                $inc: { attempts: 1 },
                            },
                        );
                        delivered += 1;
                    } catch (error) {
                        await CalendarReminderDeliveryQueries.updateCalendarReminderDeliveryQuery(
                            delivery.id,
                            {
                                $set: {
                                    status: "failed",
                                    lastError:
                                        error instanceof Error
                                            ? error.message.slice(0, 1000)
                                            : "Unknown reminder failure",
                                },
                                $inc: { attempts: 1 },
                            },
                        );
                    }
                }
            }
        }
    }
    return delivered;
}
