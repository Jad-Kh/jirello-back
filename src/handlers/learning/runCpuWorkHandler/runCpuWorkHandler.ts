import { performance } from "node:perf_hooks";
import type { IRequest } from "../../../helpers/api.js";
import type { RunCpuWorkRequest } from "./runCpuWorkRequest.js";
import { countPrimes, countPrimesInWorker } from "../../../services/learning/learningHelpers.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";

export async function runCpuWorkHandler(
    request: IRequest<RunCpuWorkRequest, "">,
    _response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const startedAt = performance.now();
        const primes =
            request.params.mode === "worker"
                ? await countPrimesInWorker(value.limit)
                : countPrimes(value.limit);
        request.responseModel = {
            mode: request.params.mode,
            limit: value.limit,
            primes,
            durationMs: performance.now() - startedAt,
        };
        request.successResponse = {
            code: 200,
            message:
                request.params.mode === "worker"
                    ? "Calculation ran in a worker thread, leaving the event loop responsive."
                    : "Calculation ran synchronously and blocked this Node process's event loop.",
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
