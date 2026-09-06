import { describe, expect, it } from "vitest";
import { getEnvironment } from "../src/startup/environment.js";

const validEnvironment = {
    NODE_ENV: "test",
    MONGO_CONNECT_URI: "mongodb://127.0.0.1:27017/test",
    JWT_SECRET: "a-secret-that-is-long-enough-for-tests",
    REDIS_URL: "redis://127.0.0.1:6379",
};

describe("environment configuration", () => {
    it("applies safe defaults", () => {
        const environment = getEnvironment(validEnvironment);

        expect(environment.port).toBe(8082);
        expect(environment.jsonLimit).toBe("1mb");
        expect(environment.trustProxyHops).toBe(0);
        expect(environment.corsOrigins).toEqual(["http://localhost:3000"]);
        expect(environment.accessTokenSecret).toBe(validEnvironment.JWT_SECRET);
    });

    it("configures the exact number of trusted reverse-proxy hops", () => {
        const environment = getEnvironment({
            ...validEnvironment,
            TRUST_PROXY_HOPS: "1",
        });

        expect(environment.trustProxyHops).toBe(1);
        expect(() => getEnvironment({ ...validEnvironment, TRUST_PROXY_HOPS: "not-a-number" })).toThrow(
            "Invalid environment configuration",
        );
    });

    it("rejects missing secrets and database configuration", () => {
        expect(() => getEnvironment({ NODE_ENV: "test" })).toThrow("Invalid environment configuration");
    });

    it("parses multiple allowed origins", () => {
        const environment = getEnvironment({
            ...validEnvironment,
            CORS_ORIGIN: "https://one.example, https://two.example",
        });

        expect(environment.corsOrigins).toEqual(["https://one.example", "https://two.example"]);
    });

    it("requires a complete Pusher credential set", () => {
        expect(() => getEnvironment({ ...validEnvironment, PUSHER_APP_ID: "app" })).toThrow(
            "Invalid environment configuration",
        );
        const environment = getEnvironment({
            ...validEnvironment,
            PUSHER_APP_ID: "app",
            PUSHER_KEY: "key",
            PUSHER_SECRET: "secret",
            PUSHER_CLUSTER: "eu",
        });
        expect(environment.pusher).toEqual({
            appId: "app",
            key: "key",
            secret: "secret",
            cluster: "eu",
            useTls: true,
        });
    });

    it("requires Redis when production email delivery uses BullMQ", () => {
        const productionEnvironment = {
            ...validEnvironment,
            NODE_ENV: "production",
            PROCESS_ROLE: "api",
            SMTP_HOST: "smtp.example.com",
            SMTP_FROM: "jirello@example.com",
            METRICS_TOKEN: "m".repeat(32),
            PUSHER_APP_ID: "app",
            PUSHER_KEY: "key",
            PUSHER_SECRET: "secret",
            PUSHER_CLUSTER: "eu",
        };
        const { REDIS_URL: _redisUrl, ...withoutRedis } = productionEnvironment;

        expect(() => getEnvironment(withoutRedis)).toThrow("Invalid environment configuration");
        expect(getEnvironment(productionEnvironment).redisUrl).toBe("redis://127.0.0.1:6379");
        expect(() => getEnvironment({ ...productionEnvironment, PROCESS_ROLE: "all" })).toThrow(
            "PROCESS_ROLE must select one dedicated production role",
        );
    });
});
