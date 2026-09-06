import { startLearningQueueWorker } from "../infrastructure/learningQueue.js";
import { startEmailDeliveryWorker } from "../queues/emailQueue.js";

export async function startQueueWorkers(): Promise<() => Promise<void>> {
    const stopLearning = await startLearningQueueWorker();
    let stopEmail: (() => Promise<void>) | undefined;
    try {
        stopEmail = await startEmailDeliveryWorker();
    } catch (error) {
        await stopLearning();
        throw error;
    }

    return async () => {
        await Promise.all([stopLearning(), stopEmail()]);
    };
}
