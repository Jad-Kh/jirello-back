import * as Sentry from "@sentry/node";
import { getEnvironment } from "../startup/environment.js";
import { logger } from "./logger.js";

const environment = getEnvironment();
if (environment.sentryDsn) {
    Sentry.init({
        dsn: environment.sentryDsn,
        environment: environment.nodeEnv,
        sendDefaultPii: false,
    });
}

export function reportError(error: unknown, context: Record<string, unknown> = {}): void {
    logger.error({ err: error, ...context }, "Application error");
    if (environment.sentryDsn) {
        Sentry.captureException(error, { extra: context });
    }
}
