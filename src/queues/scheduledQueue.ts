import { Queue, Worker } from "bullmq";
import { performance } from "node:perf_hooks";
import { logger } from "../helpers/logger.js";
import { recordWorkerJob } from "../helpers/metrics.js";
import { bullMqConnection } from "../infrastructure/bullmq.js";
import { publishCalendarReminders } from "../workers/calendar/calendarReminderWorker.js";
import { publishUpcomingDeadlineNotifications } from "../workers/notification/deadlineWorker.js";

type ScheduledJobName = "calendar-reminders" | "deadline-notifications";
type ScheduledJobData = Record<string, never>;

let scheduledQueue: Queue<ScheduledJobData, unknown, string> | undefined;

function getScheduledQueue() {
    scheduledQueue ??= new Queue<ScheduledJobData, unknown, string>("scheduled-scans", {
        connection: bullMqConnection(),
    });
    return scheduledQueue;
}

export async function registerScheduledJobs(): Promise<void> {
    const queue = getScheduledQueue();
    await queue.upsertJobScheduler(
        "calendar-reminders-v1",
        { every: 60_000 },
        {
            name: "calendar-reminders",
            data: {},
            opts: {
                attempts: 5,
                backoff: { type: "exponential", delay: 2_000 },
                removeOnComplete: 100,
                removeOnFail: 500,
            },
        },
    );
    await queue.upsertJobScheduler(
        "deadline-notifications-v1",
        { every: 5 * 60_000 },
        {
            name: "deadline-notifications",
            data: {},
            opts: {
                attempts: 5,
                backoff: { type: "exponential", delay: 5_000 },
                removeOnComplete: 100,
                removeOnFail: 500,
            },
        },
    );
    await queue.waitUntilReady();
}

export async function startScheduledQueueWorker(): Promise<() => Promise<void>> {
    await registerScheduledJobs();
    const worker = new Worker<ScheduledJobData, unknown, ScheduledJobName>(
        "scheduled-scans",
        async (job) => {
            const startedAt = performance.now();
            try {
                if (job.name === "calendar-reminders") {
                    const delivered = await publishCalendarReminders();
                    recordWorkerJob("scheduled-scans", job.name, "completed", startedAt);
                    logger.info({ jobId: job.id, delivered }, "Calendar reminder schedule completed");
                    return { delivered };
                }
                if (job.name === "deadline-notifications") {
                    const created = await publishUpcomingDeadlineNotifications();
                    recordWorkerJob("scheduled-scans", job.name, "completed", startedAt);
                    logger.info({ jobId: job.id, created }, "Deadline notification schedule completed");
                    return { created };
                }
                throw new Error(`Unsupported scheduled job: ${job.name}`);
            } catch (error) {
                recordWorkerJob("scheduled-scans", job.name, "failed", startedAt);
                throw error;
            }
        },
        { connection: bullMqConnection(), concurrency: 1 },
    );
    worker.on("failed", (job, error) => {
        logger.error({ err: error, jobId: job?.id, jobName: job?.name }, "Scheduled job failed");
    });
    await worker.waitUntilReady();

    return async () => {
        await worker.close();
        await scheduledQueue?.close();
        scheduledQueue = undefined;
    };
}
