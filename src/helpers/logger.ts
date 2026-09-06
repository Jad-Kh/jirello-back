import pino from "pino";
import { getEnvironment } from "../startup/environment.js";

const environment = getEnvironment();

export const logger = pino({
    level: environment.nodeEnv === "test" ? "silent" : environment.logLevel,
    base: {
        service: "jirello-back",
        instanceId: environment.instanceId,
        processRole: environment.processRole,
    },
    redact: {
        paths: ["req.headers.authorization", "req.headers.cookie", "password", "token", "refreshToken"],
        censor: "[REDACTED]",
    },
});
