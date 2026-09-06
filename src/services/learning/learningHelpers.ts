import { createHash } from "node:crypto";
import { Worker } from "node:worker_threads";
import { Types } from "mongoose";

export type LearningCursor = {
    createdAt: string;
    id: string;
};

export function hashLearningRequest(value: unknown): string {
    return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function encodeLearningCursor(createdAt: Date, id: string): string {
    return Buffer.from(JSON.stringify({ createdAt: createdAt.toISOString(), id })).toString("base64url");
}

export function decodeLearningCursor(cursor: string): LearningCursor {
    const decoded = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as LearningCursor;
    if (
        !decoded.createdAt ||
        !Types.ObjectId.isValid(decoded.id) ||
        Number.isNaN(Date.parse(decoded.createdAt))
    ) {
        throw new Error("Invalid cursor.");
    }
    return decoded;
}

export function countPrimes(limit: number): number {
    let count = 0;
    for (let candidate = 2; candidate <= limit; candidate += 1) {
        let prime = true;
        const maximum = Math.sqrt(candidate);
        for (let divisor = 2; divisor <= maximum; divisor += 1) {
            if (candidate % divisor === 0) {
                prime = false;
                break;
            }
        }
        if (prime) count += 1;
    }
    return count;
}

const workerSource = `
const { parentPort, workerData } = require("node:worker_threads");
function countPrimes(limit) {
    let count = 0;
    for (let candidate = 2; candidate <= limit; candidate += 1) {
        let prime = true;
        const maximum = Math.sqrt(candidate);
        for (let divisor = 2; divisor <= maximum; divisor += 1) {
            if (candidate % divisor === 0) {
                prime = false;
                break;
            }
        }
        if (prime) count += 1;
    }
    return count;
}
parentPort.postMessage(countPrimes(workerData.limit));
`;

export function countPrimesInWorker(limit: number): Promise<number> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(workerSource, { eval: true, workerData: { limit } });
        worker.once("message", (result: number) => resolve(result));
        worker.once("error", reject);
        worker.once("exit", (code) => {
            if (code !== 0) reject(new Error(`CPU worker stopped with exit code ${code}.`));
        });
    });
}
