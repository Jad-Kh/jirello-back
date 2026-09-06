import { logger } from "../helpers/logger.js";
import { closeRedis, getRedisClient } from "./redis.js";

export async function readJsonCache<T>(key: string): Promise<T | null> {
    try {
        const client = await getRedisClient();
        const value = await client.get(key);
        return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
        logger.warn({ err: error, cacheKey: key }, "Redis cache read failed");
        return null;
    }
}

export async function writeJsonCache(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
        const client = await getRedisClient();
        await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
    } catch (error) {
        logger.warn({ err: error, cacheKey: key }, "Redis cache write failed");
    }
}

export async function cacheNamespaceVersion(namespace: string): Promise<string> {
    try {
        const client = await getRedisClient();
        return (await client.get(`cache-version:${namespace}`)) ?? "0";
    } catch (error) {
        logger.warn({ err: error, namespace }, "Redis cache version read failed");
        return "0";
    }
}

export async function invalidateCacheNamespace(namespace: string): Promise<void> {
    try {
        const client = await getRedisClient();
        await client.incr(`cache-version:${namespace}`);
    } catch (error) {
        logger.warn({ err: error, namespace }, "Redis cache invalidation failed");
    }
}

export async function closeRedisCache(): Promise<void> {
    await closeRedis();
}
