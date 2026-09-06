import { describe, expect, it } from "vitest";
import { CalendarEventModel } from "../src/database/models/calendar/CalendarEvent.js";
import { expandCalendarEvent } from "../src/services/calendar/recurrence.js";

describe("calendar recurrence", () => {
    it("expands multi-day weekly recurrences and preserves duration", () => {
        const event = {
            id: "event-1",
            startAt: new Date("2026-08-24T09:00:00.000Z"),
            endAt: new Date("2026-08-24T10:30:00.000Z"),
            recurrence: {
                frequency: "weekly" as const,
                interval: 1,
                byWeekday: [1, 3],
                excludedDates: [],
            },
        };
        const occurrences = expandCalendarEvent(
            event,
            new Date("2026-08-24T00:00:00.000Z"),
            new Date("2026-09-01T00:00:00.000Z"),
        );
        expect(occurrences.map((item) => item.startAt.toISOString())).toEqual([
            "2026-08-24T09:00:00.000Z",
            "2026-08-26T09:00:00.000Z",
            "2026-08-31T09:00:00.000Z",
        ]);
        expect(occurrences[1]!.endAt.getTime() - occurrences[1]!.startAt.getTime()).toBe(90 * 60_000);
    });

    it("honors recurrence exclusions and count", () => {
        const occurrences = expandCalendarEvent(
            {
                id: "event-2",
                startAt: new Date("2026-08-01T12:00:00.000Z"),
                endAt: new Date("2026-08-01T13:00:00.000Z"),
                recurrence: {
                    frequency: "daily",
                    interval: 1,
                    byWeekday: [],
                    count: 3,
                    excludedDates: [new Date("2026-08-02T00:00:00.000Z")],
                },
            },
            new Date("2026-08-01T00:00:00.000Z"),
            new Date("2026-08-10T00:00:00.000Z"),
        );
        expect(occurrences.map((item) => item.startAt.getUTCDate())).toEqual([1, 3]);
    });

    it("keeps recurring meetings at the same local time across daylight-saving changes", () => {
        const occurrences = expandCalendarEvent(
            {
                id: "event-dst",
                timezone: "America/New_York",
                startAt: new Date("2026-03-01T14:00:00.000Z"),
                endAt: new Date("2026-03-01T15:00:00.000Z"),
                recurrence: { frequency: "weekly", interval: 1, byWeekday: [0], excludedDates: [] },
            },
            new Date("2026-03-01T00:00:00.000Z"),
            new Date("2026-03-16T00:00:00.000Z"),
        );
        expect(occurrences.map((item) => item.startAt.toISOString())).toEqual([
            "2026-03-01T14:00:00.000Z",
            "2026-03-08T13:00:00.000Z",
            "2026-03-15T13:00:00.000Z",
        ]);
    });
});

describe("calendar event persistence", () => {
    it("validates meetings, attendees, reminders, and optimistic versions", () => {
        const event = new CalendarEventModel({
            ownerId: "507f1f77bcf86cd799439011",
            organizerId: "507f1f77bcf86cd799439011",
            kind: "meeting",
            title: "Planning",
            startAt: new Date("2026-08-25T09:00:00.000Z"),
            endAt: new Date("2026-08-25T10:00:00.000Z"),
            attendees: [{ email: "client@example.com", optional: false }],
            reminders: [{ minutesBefore: 15, method: "email" }],
        });
        expect(event.validateSync()).toBeUndefined();
        expect(event.version).toBe(1);
        expect(event.timezone).toBe("UTC");
        expect(event.attendees[0]!.response).toBe("pending");
    });
});
