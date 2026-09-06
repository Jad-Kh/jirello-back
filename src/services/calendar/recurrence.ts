import type { ICalendarEvent } from "../../database/models/calendar/ICalendarEvent.js";

export type CalendarOccurrence = {
    occurrenceId: string;
    eventId: string;
    startAt: Date;
    endAt: Date;
};

const dayMs = 86_400_000;

type DateParts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

function zonedParts(date: Date, timezone: string): DateParts {
    const values = Object.fromEntries(
        new Intl.DateTimeFormat("en-CA", {
            timeZone: timezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23",
        })
            .formatToParts(date)
            .filter((part) => part.type !== "literal")
            .map((part) => [part.type, Number(part.value)]),
    );
    return values as DateParts;
}

function timezoneOffset(date: Date, timezone: string): number {
    const parts = zonedParts(date, timezone);
    return (
        Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) -
        date.getTime()
    );
}

function fromZonedParts(parts: DateParts, timezone: string): Date {
    const localTimestamp = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second,
    );
    let candidate = new Date(localTimestamp);
    candidate = new Date(localTimestamp - timezoneOffset(candidate, timezone));
    candidate = new Date(localTimestamp - timezoneOffset(candidate, timezone));
    return candidate;
}

function addZonedDay(date: Date, timezone: string): Date {
    const parts = zonedParts(date, timezone);
    const next = new Date(
        Date.UTC(parts.year, parts.month - 1, parts.day + 1, parts.hour, parts.minute, parts.second),
    );
    return fromZonedParts(
        {
            year: next.getUTCFullYear(),
            month: next.getUTCMonth() + 1,
            day: next.getUTCDate(),
            hour: next.getUTCHours(),
            minute: next.getUTCMinutes(),
            second: next.getUTCSeconds(),
        },
        timezone,
    );
}

function matchesRecurrence(
    candidate: Date,
    origin: Date,
    recurrence: NonNullable<ICalendarEvent["recurrence"]>,
    timezone: string,
): boolean {
    const candidateParts = zonedParts(candidate, timezone);
    const originParts = zonedParts(origin, timezone);
    const candidateDate = Date.UTC(candidateParts.year, candidateParts.month - 1, candidateParts.day);
    const originDate = Date.UTC(originParts.year, originParts.month - 1, originParts.day);
    const days = Math.floor((candidateDate - originDate) / dayMs);
    if (recurrence.frequency === "daily") return days % recurrence.interval === 0;
    if (recurrence.frequency === "weekly") {
        const originWeekday = new Date(originDate).getUTCDay();
        const candidateWeekday = new Date(candidateDate).getUTCDay();
        const weekdays = recurrence.byWeekday?.length ? recurrence.byWeekday : [originWeekday];
        return Math.floor(days / 7) % recurrence.interval === 0 && weekdays.includes(candidateWeekday);
    }
    const months = (candidateParts.year - originParts.year) * 12 + candidateParts.month - originParts.month;
    const expectedDay = Math.min(
        originParts.day,
        new Date(Date.UTC(candidateParts.year, candidateParts.month, 0)).getUTCDate(),
    );
    if (recurrence.frequency === "monthly")
        return months % recurrence.interval === 0 && candidateParts.day === expectedDay;
    return (
        candidateParts.year >= originParts.year &&
        (candidateParts.year - originParts.year) % recurrence.interval === 0 &&
        candidateParts.month === originParts.month &&
        candidateParts.day === expectedDay
    );
}

export function expandCalendarEvent(
    event: Pick<ICalendarEvent, "startAt" | "endAt" | "recurrence"> & { id: string; timezone?: string },
    rangeStart: Date,
    rangeEnd: Date,
    limit = 500,
): CalendarOccurrence[] {
    const duration = event.endAt.getTime() - event.startAt.getTime();
    const recurrence = event.recurrence;
    const timezone = event.timezone ?? "UTC";
    if (!recurrence) {
        return event.endAt > rangeStart && event.startAt < rangeEnd
            ? [
                  {
                      occurrenceId: `${event.id}:${event.startAt.toISOString()}`,
                      eventId: event.id,
                      startAt: event.startAt,
                      endAt: event.endAt,
                  },
              ]
            : [];
    }

    const excluded = new Set((recurrence.excludedDates ?? []).map((date) => date.toISOString().slice(0, 10)));
    const occurrences: CalendarOccurrence[] = [];
    let cursor = new Date(event.startAt);
    let generated = 0;
    const maximum = recurrence.count ?? Number.POSITIVE_INFINITY;
    let iterations = 0;

    while (cursor < rangeEnd && generated < maximum && occurrences.length < limit && iterations < 200_000) {
        const matches = matchesRecurrence(cursor, event.startAt, recurrence, timezone);
        const beforeUntil = !recurrence.until || cursor <= recurrence.until;
        if (!beforeUntil) break;
        const occurrenceEnd = new Date(cursor.getTime() + duration);
        if (matches) {
            generated += 1;
            if (
                !excluded.has(cursor.toISOString().slice(0, 10)) &&
                occurrenceEnd > rangeStart &&
                cursor < rangeEnd
            ) {
                occurrences.push({
                    occurrenceId: `${event.id}:${cursor.toISOString()}`,
                    eventId: event.id,
                    startAt: new Date(cursor),
                    endAt: occurrenceEnd,
                });
            }
        }
        cursor = addZonedDay(cursor, timezone);
        iterations += 1;
    }
    return occurrences;
}
