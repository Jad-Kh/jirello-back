import { connectDatabase, disconnectDatabase } from "../database/connection/connection.js";
import { TaskModel } from "../database/models/task/Task.js";
import { logger } from "../helpers/logger.js";
import { getEnvironment } from "../startup/environment.js";

try {
    await connectDatabase(getEnvironment().mongoUri);
    await Promise.all([
        TaskModel.collection.updateMany({ version: { $exists: false } }, { $set: { version: 1 } }),
        TaskModel.collection.updateMany({ position: { $exists: false } }, { $set: { position: 0 } }),
        TaskModel.collection.updateMany({ status: "To do" }, { $set: { status: "todo" } }),
        TaskModel.collection.updateMany({ status: "In progress" }, { $set: { status: "in-progress" } }),
        TaskModel.collection.updateMany({ status: "Done" }, { $set: { status: "done", accomplished: true } }),
    ]);

    const legacyTasks = await TaskModel.collection
        .find({ deadlineAt: { $exists: false }, deadline: { $nin: [null, "", "Unlimited"] } })
        .toArray();
    const deadlineUpdates = legacyTasks.flatMap((task) => {
        const deadlineAt = new Date(String(task.deadline));
        return Number.isNaN(deadlineAt.getTime())
            ? []
            : [{ updateOne: { filter: { _id: task._id }, update: { $set: { deadlineAt } } } }];
    });
    if (deadlineUpdates.length) await TaskModel.collection.bulkWrite(deadlineUpdates);
    logger.info({ migratedDeadlines: deadlineUpdates.length }, "Realtime data migration completed");
} catch (error) {
    logger.fatal({ err: error }, "Realtime data migration failed");
    process.exitCode = 1;
} finally {
    await disconnectDatabase();
}
