import { createClient } from "redis";
import { logger } from "../helpers/logger.js";
import { getEnvironment } from "../startup/environment.js";

export type SharedRedisClient = ReturnType<typeof createClient>;

let client: SharedRedisClient | undefined;
let connection: Promise<SharedRedisClient> | undefined;

export async function connectRedis(): Promise<SharedRedisClient> {
    if (client?.isReady) return client;
    if (connection) return connection;

    client = createClient({
        url: getEnvironment().redisUrl,
        socket: {
            connectTimeout: 5_000,
            reconnectStrategy(retries) {
                return retries > 10 ? false : Math.min(100 * 2 ** retries, 2_000);
            },
        },
    });
    client.on("error", (error) => logger.error({ err: error }, "Redis client error"));
    connection = client.connect().then(() => client as SharedRedisClient);

    try {
        return await connection;
    } catch (error) {
        client = undefined;
        throw error;
    } finally {
        connection = undefined;
    }
}

export async function getRedisClient(): Promise<SharedRedisClient> {
    return client?.isReady ? client : connectRedis();
}

export async function pingRedis(): Promise<boolean> {
    try {
        return (await (await getRedisClient()).ping()) === "PONG";
    } catch {
        return false;
    }
}

export async function closeRedis(): Promise<void> {
    if (client?.isOpen) await client.quit();
    client = undefined;
    connection = undefined;
}
