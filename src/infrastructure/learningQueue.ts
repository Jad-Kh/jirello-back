import { setTimeout as delay } from "node:timers/promises";
import { performance } from "node:perf_hooks";
import { Job, Queue, Worker } from "bullmq";
import { logger } from "../helpers/logger.js";
import { recordWorkerJob } from "../helpers/metrics.js";
import { bullMqConnection } from "./bullmq.js";
import { getRedisClient } from "./redis.js";

export type LearningEmailJob = {
    orderId: string;
    orderNumber: string;
    userId: string;
};

let learningQueue: Queue<LearningEmailJob> | undefined;

export async function getLearningRedis() {
    return getRedisClient();
}

export async function readOrderCache(orderId: string) {
    const client = await getLearningRedis();
    if (!client) return null;
    return client.get(`learning:order:${orderId}`);
}

export async function writeOrderCache(orderId: string, value: unknown) {
    const client = await getLearningRedis();
    if (!client) return false;
    await client.set(`learning:order:${orderId}`, JSON.stringify(value), { EX: 60 });
    return true;
}

export async function invalidateOrderCache(orderId: string) {
    const client = await getLearningRedis();
    if (!client) return false;
    await client.del(`learning:order:${orderId}`);
    return true;
}

function getLearningQueue() {
    learningQueue ??= new Queue<LearningEmailJob>("learning-order-email", {
        connection: bullMqConnection(),
    });
    return learningQueue;
}

export async function enqueueLearningEmail(data: LearningEmailJob) {
    const queue = getLearningQueue();
    try {
        const job = await queue.add("order-confirmation", data, {
            jobId: `order-confirmation-${data.orderId}`,
            attempts: 3,
            backoff: { type: "exponential", delay: 500 },
            removeOnComplete: 100,
            removeOnFail: 100,
        });
        return job.id;
    } catch (error) {
        logger.warn({ err: error, orderId: data.orderId }, "Non-critical learning email could not be queued");
        return null;
    }
}

export async function learningJobStatus(jobId: string) {
    const queue = getLearningQueue();
    if (!queue) return { state: "queue-disabled" };
    const job = await Job.fromId<LearningEmailJob>(queue, jobId);
    if (!job) return { state: "not-found" };
    return { state: await job.getState(), result: job.returnvalue, failedReason: job.failedReason };
}

export async function startLearningQueueWorker(): Promise<() => Promise<void>> {
    const worker = new Worker<LearningEmailJob>(
        "learning-order-email",
        async (job) => {
            const externalStartedAt = performance.now();
            try {
                await delay(250);
                const externalMs = performance.now() - externalStartedAt;
                recordWorkerJob("learning-order-email", job.name, "completed", externalStartedAt);
                logger.info(
                    {
                        jobId: job.id,
                        orderId: job.data.orderId,
                        orderNumber: job.data.orderNumber,
                        externalMs: Number(externalMs.toFixed(2)),
                    },
                    "Learning order confirmation processed outside the HTTP request",
                );
                return { delivered: true, externalMs: Number(externalMs.toFixed(2)) };
            } catch (error) {
                recordWorkerJob("learning-order-email", job.name, "failed", externalStartedAt);
                throw error;
            }
        },
        { connection: bullMqConnection() },
    );
    worker.on("failed", (job, error) => {
        logger.error({ err: error, jobId: job?.id }, "Learning queue job failed");
    });

    await worker.waitUntilReady();
    return async () => {
        await worker.close();
        await learningQueue?.close();
        learningQueue = undefined;
    };
}
