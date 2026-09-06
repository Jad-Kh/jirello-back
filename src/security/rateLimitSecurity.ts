import { rateLimit } from "express-rate-limit";
import { getEnvironment } from "../startup/environment.js";
import { RedisRateLimitStore } from "./redisRateLimitStore.js";

const response = { code: 429, message: "Too many requests. Please try again later." };
const distributedStore = (name: string) =>
    getEnvironment().nodeEnv === "test" ? undefined : new RedisRateLimitStore(`rate-limit:${name}`);

export const authenticationRateLimit = rateLimit({
    windowMs: 15 * 60_000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: response,
    store: distributedStore("authentication"),
});

export const recoveryRateLimit = rateLimit({
    windowMs: 60 * 60_000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: response,
    store: distributedStore("recovery"),
});

export const apiRateLimit = rateLimit({
    windowMs: 15 * 60_000,
    limit: 1_000,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: response,
    store: distributedStore("api"),
});
