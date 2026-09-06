import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import type { ICalendarEvent } from "../../database/models/calendar/ICalendarEvent.js";
import type { CalendarOccurrence } from "./recurrence.js";

export type RecurrenceWorkerEvent = Pick<ICalendarEvent, "startAt" | "endAt" | "recurrence"> & {
    id: string;
    timezone?: string;
};

type RecurrenceWorkerInput = {
    kind: "calendar-recurrence";
    events: RecurrenceWorkerEvent[];
    rangeStart: Date;
    rangeEnd: Date;
    limit: number;
};

type RecurrenceWorkerResult = {
    occurrences: CalendarOccurrence[][];
};

async function processWorkerInput(): Promise<void> {
    const input = workerData as RecurrenceWorkerInput;
    if (input.kind === "calendar-recurrence") {
        const recurrenceModuleUrl = new URL(
            import.meta.url.endsWith(".ts") ? "./recurrence.ts" : "./recurrence.js",
            import.meta.url,
        );
        const { expandCalendarEvent } = await import(recurrenceModuleUrl.href);
        const occurrences = input.events.map((event) =>
            expandCalendarEvent(event, input.rangeStart, input.rangeEnd, input.limit),
        );
        parentPort?.postMessage({ occurrences } satisfies RecurrenceWorkerResult);
    }
}

if (!isMainThread) void processWorkerInput();

export function recurrenceWorkerEvent(event: ICalendarEvent & { id: string }): RecurrenceWorkerEvent {
    return {
        id: event.id,
        startAt: event.startAt,
        endAt: event.endAt,
        timezone: event.timezone,
        recurrence: event.recurrence
            ? {
                  frequency: event.recurrence.frequency,
                  interval: event.recurrence.interval,
                  byWeekday: [...event.recurrence.byWeekday],
                  until: event.recurrence.until,
                  count: event.recurrence.count,
                  excludedDates: [...event.recurrence.excludedDates],
              }
            : undefined,
    };
}

export async function expandCalendarEventsInWorker(
    events: RecurrenceWorkerEvent[],
    rangeStart: Date,
    rangeEnd: Date,
    limit = 500,
): Promise<CalendarOccurrence[][]> {
    if (!events.length) return [];

    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL(import.meta.url), {
            ...(import.meta.url.endsWith(".ts") ? { execArgv: ["--import", "tsx"] } : {}),
            workerData: {
                kind: "calendar-recurrence",
                events,
                rangeStart,
                rangeEnd,
                limit,
            } satisfies RecurrenceWorkerInput,
        });
        const timeout = setTimeout(() => {
            void worker.terminate();
            reject(new Error("Calendar recurrence worker timed out."));
        }, 15_000);
        worker.once("message", (result: RecurrenceWorkerResult) => {
            clearTimeout(timeout);
            resolve(result.occurrences);
        });
        worker.once("error", (error) => {
            clearTimeout(timeout);
            reject(error);
        });
        worker.once("exit", (code) => {
            if (code !== 0) {
                clearTimeout(timeout);
                reject(new Error(`Calendar recurrence worker stopped with exit code ${code}.`));
            }
        });
    });
}
