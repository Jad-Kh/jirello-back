import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from "@prometheus-io/client";
import type { NextFunction, Request, Response } from "express";

export const metricsRegistry = new Registry();
collectDefaultMetrics({ register: metricsRegistry, prefix: "jirello_" });

const requestDuration = new Histogram({
    name: "jirello_http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"] as const,
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [metricsRegistry],
});

const dependencyReadiness = new Gauge({
    name: "jirello_dependency_ready",
    help: "Whether a process dependency is currently ready (1) or not ready (0)",
    labelNames: ["dependency"] as const,
    registers: [metricsRegistry],
});

export function setDependencyReadinessMetric(dependency: string, ready: boolean): void {
    dependencyReadiness.set({ dependency }, ready ? 1 : 0);
}

const workerJobs = new Counter({
    name: "jirello_worker_jobs_total",
    help: "Background jobs completed or failed",
    labelNames: ["queue", "job_name", "outcome"] as const,
    registers: [metricsRegistry],
});

const workerJobDuration = new Histogram({
    name: "jirello_worker_job_duration_seconds",
    help: "Background job processing duration in seconds",
    labelNames: ["queue", "job_name", "outcome"] as const,
    buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 15, 60],
    registers: [metricsRegistry],
});

export function recordWorkerJob(
    queue: string,
    jobName: string,
    outcome: "completed" | "failed",
    startedAtMs: number,
): void {
    const labels = { queue, job_name: jobName, outcome };
    workerJobs.inc(labels);
    workerJobDuration.observe(labels, (performance.now() - startedAtMs) / 1_000);
}

export function recordHttpMetrics(request: Request, response: Response, next: NextFunction): void {
    const startedAt = process.hrtime.bigint();
    response.once("finish", () => {
        const duration = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
        const routePath = request.route?.path as string | undefined;
        requestDuration.observe(
            {
                method: request.method,
                route: `${request.baseUrl}${routePath ?? "unmatched"}`,
                status_code: String(response.statusCode),
            },
            duration,
        );
    });
    next();
}
