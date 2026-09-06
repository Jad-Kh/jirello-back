import { Queue, type ConnectionOptions } from "bullmq";
import { getEnvironment } from "../startup/environment.js";

let readinessQueue: Queue | undefined;

export function bullMqConnection(): ConnectionOptions {
    const url = new URL(getEnvironment().redisUrl);
    return {
        host: url.hostname,
        port: Number(url.port || 6379),
        username: url.username || undefined,
        password: url.password || undefined,
        tls: url.protocol === "rediss:" ? {} : undefined,
        maxRetriesPerRequest: null,
    };
}

export async function connectBullMq(): Promise<void> {
    readinessQueue ??= new Queue("jirello-readiness", { connection: bullMqConnection() });
    const timeout = new Promise<never>((_resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("BullMQ initialization timed out.")), 15_000);
        timer.unref();
    });
    await Promise.race([readinessQueue.waitUntilReady(), timeout]);
    await Promise.race([readinessQueue.getJobCounts("waiting", "active", "failed"), timeout]);
}

export async function pingBullMq(): Promise<boolean> {
    try {
        await connectBullMq();
        return true;
    } catch {
        return false;
    }
}

export async function closeBullMq(): Promise<void> {
    await readinessQueue?.close();
    readinessQueue = undefined;
}
