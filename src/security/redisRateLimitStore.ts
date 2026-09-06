import type { Options, Store } from "express-rate-limit";
import { getRedisClient } from "../infrastructure/redis.js";

export class RedisRateLimitStore implements Store {
    private windowMs = 60_000;

    public constructor(public readonly prefix: string) {}

    public init(options: Options): void {
        this.windowMs = options.windowMs;
    }

    public async increment(key: string) {
        const client = await getRedisClient();
        const redisKey = `${this.prefix}:${key}`;
        const result = (await client.eval(
            `
                local hits = redis.call("INCR", KEYS[1])
                if hits == 1 then
                    redis.call("PEXPIRE", KEYS[1], ARGV[1])
                end
                return { hits, redis.call("PTTL", KEYS[1]) }
            `,
            { keys: [redisKey], arguments: [String(this.windowMs)] },
        )) as [number, number];
        const ttl = Math.max(Number(result[1]), 0);
        return { totalHits: Number(result[0]), resetTime: new Date(Date.now() + ttl) };
    }

    public async decrement(key: string): Promise<void> {
        const client = await getRedisClient();
        const redisKey = `${this.prefix}:${key}`;
        await client.eval(
            `
                local hits = tonumber(redis.call("GET", KEYS[1]) or "0")
                if hits > 0 then redis.call("DECR", KEYS[1]) end
                return hits
            `,
            { keys: [redisKey], arguments: [] },
        );
    }

    public async resetKey(key: string): Promise<void> {
        await (await getRedisClient()).del(`${this.prefix}:${key}`);
    }

    public async get(key: string) {
        const client = await getRedisClient();
        const redisKey = `${this.prefix}:${key}`;
        const [hits, ttl] = await Promise.all([client.get(redisKey), client.pTTL(redisKey)]);
        if (hits === null) return undefined;
        return {
            totalHits: Number(hits),
            resetTime: ttl > 0 ? new Date(Date.now() + ttl) : undefined,
        };
    }
}
