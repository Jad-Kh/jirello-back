import mongoose from "mongoose";
import { setDependencyReadinessMetric } from "../helpers/metrics.js";
import { pingBullMq } from "../infrastructure/bullmq.js";
import { pingRedis } from "../infrastructure/redis.js";
import type { Environment } from "./environment.js";

let applicationInitialized = false;
let workerInitialized = false;

export function markApplicationInitialized(value = true): void {
    applicationInitialized = value;
}

export function markWorkerInitialized(value = true): void {
    workerInitialized = value;
}

export async function readinessSnapshot(role: Environment["processRole"]) {
    const mongoReady = mongoose.connection.readyState === 1;
    const requiresWorker = role !== "api";
    const [redisReady, bullMqReady] = applicationInitialized
        ? await Promise.all([pingRedis(), pingBullMq()])
        : [false, false];
    const ready =
        applicationInitialized &&
        mongoReady &&
        redisReady &&
        bullMqReady &&
        (!requiresWorker || workerInitialized);

    const dependencies = {
        application: applicationInitialized,
        mongo: mongoReady,
        redis: redisReady,
        bullmq: bullMqReady,
        worker: requiresWorker ? workerInitialized : "not-required",
    } as const;
    for (const [dependency, value] of Object.entries(dependencies)) {
        setDependencyReadinessMetric(dependency, value === true);
    }

    return {
        status: ready ? "ready" : "not-ready",
        role,
        dependencies,
    } as const;
}

export function resetReadiness(): void {
    applicationInitialized = false;
    workerInitialized = false;
}
