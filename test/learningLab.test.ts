import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import {
    countPrimes,
    countPrimesInWorker,
    decodeLearningCursor,
    encodeLearningCursor,
    hashLearningRequest,
} from "../src/services/learning/learningHelpers.js";

describe("learning lab helpers", () => {
    it("round-trips a stable cursor", () => {
        const createdAt = new Date("2026-08-27T00:00:00.000Z");
        const id = new Types.ObjectId().toString();

        expect(decodeLearningCursor(encodeLearningCursor(createdAt, id))).toEqual({
            createdAt: createdAt.toISOString(),
            id,
        });
    });

    it("rejects malformed cursors", () => {
        expect(() => decodeLearningCursor("not-a-cursor")).toThrow();
    });

    it("hashes identical idempotent requests identically", () => {
        const request = { itemName: "Notebook", quantity: 2, unitPrice: 10 };

        expect(hashLearningRequest(request)).toBe(hashLearningRequest({ ...request }));
        expect(hashLearningRequest(request)).not.toBe(hashLearningRequest({ ...request, quantity: 3 }));
    });

    it("returns the same CPU result on the event loop and in a worker", async () => {
        expect(await countPrimesInWorker(25_000)).toBe(countPrimes(25_000));
    });
});
