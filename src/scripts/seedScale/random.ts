import { createHash } from "node:crypto";

export function numericSeed(value: string): number {
    return createHash("sha256").update(value).digest().readUInt32LE(0);
}

export function createRandom(seed: string) {
    let state = numericSeed(seed);

    function next() {
        state |= 0;
        state = (state + 0x6d2b79f5) | 0;
        let result = Math.imul(state ^ (state >>> 15), 1 | state);
        result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result;
        return ((result ^ (result >>> 14)) >>> 0) / 4_294_967_296;
    }

    return {
        next,
        integer(minimum: number, maximum: number) {
            return Math.floor(next() * (maximum - minimum + 1)) + minimum;
        },
        pick<T>(values: readonly T[]): T {
            const value = values[Math.floor(next() * values.length)];
            if (value === undefined) throw new Error("Cannot choose from an empty collection.");
            return value;
        },
        chance(probability: number) {
            return next() < probability;
        },
        weighted<T>(values: readonly { value: T; weight: number }[]): T {
            const target = next();
            let cumulative = 0;
            for (const item of values) {
                cumulative += item.weight;
                if (target <= cumulative) return item.value;
            }
            const fallback = values.at(-1);
            if (!fallback) throw new Error("Cannot choose from an empty weighted collection.");
            return fallback.value;
        },
    };
}

export type SeedRandom = ReturnType<typeof createRandom>;
