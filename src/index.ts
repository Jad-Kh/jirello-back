import { logger } from "./helpers/logger.js";
import { startRuntime } from "./startup/runtime.js";

try {
    const runtime = await startRuntime();

    let shuttingDown = false;
    const shutdown = (signal: NodeJS.Signals): void => {
        if (shuttingDown) return;
        shuttingDown = true;
        logger.info({ signal }, "Shutdown requested");
        const forceShutdown = setTimeout(() => {
            logger.error("Graceful shutdown timed out");
            runtime.server.closeAllConnections();
            process.exitCode = 1;
        }, 10_000);
        forceShutdown.unref();
        void runtime
            .close()
            .catch((error) => {
                logger.error({ err: error }, "Server shutdown failed");
                process.exitCode = 1;
            })
            .finally(() => clearTimeout(forceShutdown));
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
} catch (error) {
    logger.fatal({ err: error }, "Server startup failed");
    process.exitCode = 1;
}
