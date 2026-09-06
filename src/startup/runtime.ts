import type { Server } from "node:http";
import { connectDatabase, disconnectDatabase } from "../database/connection/connection.js";
import { logger } from "../helpers/logger.js";
import { closeBullMq, connectBullMq } from "../infrastructure/bullmq.js";
import { closeRedis, connectRedis } from "../infrastructure/redis.js";
import { startScheduledQueueWorker } from "../queues/scheduledQueue.js";
import { startOutboxPublisher } from "../realtime/outboxPublisher.js";
import { startQueueWorkers } from "../workers/queueWorkers.js";
import { createApp, createOperationalApp } from "./config.js";
import { type Environment, getEnvironment } from "./environment.js";
import { markApplicationInitialized, markWorkerInitialized, resetReadiness } from "./readiness.js";

type StopWorker = () => void | Promise<void>;

export type RuntimeHandle = {
    server: Server;
    close: () => Promise<void>;
};

async function listen(environment: Environment): Promise<Server> {
    const servesBusinessApi = environment.processRole === "api" || environment.processRole === "all";
    const app = servesBusinessApi ? createApp(environment) : createOperationalApp(environment);

    return new Promise((resolve, reject) => {
        const server = app.listen(environment.port, () => resolve(server));
        server.once("error", reject);
        server.requestTimeout = 30_000;
        server.headersTimeout = 35_000;
    });
}

async function startRoleWorkers(environment: Environment): Promise<StopWorker[]> {
    const stoppers: StopWorker[] = [];
    const role = environment.processRole;

    try {
        if (role === "queue-worker" || role === "all") {
            stoppers.push(await startQueueWorkers());
        }
        if (role === "scheduler" || role === "all") {
            stoppers.push(await startScheduledQueueWorker());
        }
        if (role === "outbox-worker" || role === "all") {
            stoppers.push(startOutboxPublisher());
        }
        if (role !== "api") {
            markWorkerInitialized();
        }
        return stoppers;
    } catch (error) {
        for (const stop of stoppers.reverse()) {
            await stop();
        }
        throw error;
    }
}

export async function startRuntime(environment: Environment = getEnvironment()): Promise<RuntimeHandle> {
    resetReadiness();
    let workerStoppers: StopWorker[] = [];
    let server: Server;
    try {
        await connectDatabase(environment.mongoUri);
        await connectRedis();
        await connectBullMq();
        markApplicationInitialized();
        workerStoppers = await startRoleWorkers(environment);
        server = await listen(environment);
    } catch (error) {
        resetReadiness();
        for (const stop of workerStoppers.reverse()) {
            await stop();
        }
        await Promise.allSettled([closeBullMq(), closeRedis(), disconnectDatabase()]);
        throw error;
    }
    logger.info(
        { port: environment.port, role: environment.processRole, instanceId: environment.instanceId },
        "Jirello process initialized",
    );

    let closing: Promise<void> | undefined;
    return {
        server,
        close() {
            closing ??= (async () => {
                resetReadiness();
                await new Promise<void>((resolve, reject) => {
                    server.close((error) => (error ? reject(error) : resolve()));
                });
                for (const stop of workerStoppers.reverse()) {
                    await stop();
                }
                await closeBullMq();
                await closeRedis();
                await disconnectDatabase();
            })();
            return closing;
        },
    };
}
