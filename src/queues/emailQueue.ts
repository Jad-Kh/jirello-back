import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import { Queue, Worker } from "bullmq";
import { bullMqConnection } from "../infrastructure/bullmq.js";
import { logger } from "../helpers/logger.js";
import { recordWorkerJob } from "../helpers/metrics.js";
import { sendPasswordResetEmail } from "../helpers/mailer.js";

export type PasswordResetEmailJob = {
    email: string;
    token: string;
};

let emailQueue: Queue<PasswordResetEmailJob> | undefined;

function getEmailQueue(): Queue<PasswordResetEmailJob> {
    emailQueue ??= new Queue<PasswordResetEmailJob>("transactional-email", {
        connection: bullMqConnection(),
    });
    return emailQueue;
}

export async function enqueuePasswordResetEmail(data: PasswordResetEmailJob): Promise<string | null> {
    const queue = getEmailQueue();
    const job = await queue.add("password-reset", data, {
        jobId: `password-reset-${createHash("sha256").update(`${data.email}:${data.token}`).digest("hex")}`,
        attempts: 5,
        backoff: { type: "exponential", delay: 1_000 },
        removeOnComplete: 1_000,
        removeOnFail: 1_000,
    });
    return job.id ?? null;
}

export async function startEmailDeliveryWorker(): Promise<() => Promise<void>> {
    const worker = new Worker<PasswordResetEmailJob>(
        "transactional-email",
        async (job) => {
            const externalStartedAt = performance.now();
            try {
                const sent = await sendPasswordResetEmail(job.data.email, job.data.token);
                const externalMs = performance.now() - externalStartedAt;
                if (!sent) throw new Error("Password reset email was not accepted by the mail transport.");
                recordWorkerJob("transactional-email", job.name, "completed", externalStartedAt);
                logger.info(
                    { jobId: job.id, jobName: job.name, externalMs: Number(externalMs.toFixed(2)) },
                    "Transactional email delivered by background worker",
                );
                return { delivered: true, externalMs: Number(externalMs.toFixed(2)) };
            } catch (error) {
                recordWorkerJob("transactional-email", job.name, "failed", externalStartedAt);
                throw error;
            }
        },
        { connection: bullMqConnection(), concurrency: 5 },
    );
    worker.on("failed", (job, error) => {
        logger.error({ err: error, jobId: job?.id, jobName: job?.name }, "Transactional email job failed");
    });

    await worker.waitUntilReady();
    return async () => {
        await worker.close();
        await emailQueue?.close();
        emailQueue = undefined;
    };
}
