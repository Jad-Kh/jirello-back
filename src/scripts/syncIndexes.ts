import { connectDatabase, disconnectDatabase } from "../database/connection/connection.js";
import { ensureDatabaseIndexes } from "../database/indexes.js";
import { logger } from "../helpers/logger.js";
import { getEnvironment } from "../startup/environment.js";

try {
    await connectDatabase(getEnvironment().mongoUri);
    await ensureDatabaseIndexes();
    logger.info("Database indexes are synchronized");
} catch (error) {
    logger.fatal({ err: error }, "Database index synchronization failed");
    process.exitCode = 1;
} finally {
    await disconnectDatabase();
}
