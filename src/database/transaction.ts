import { AsyncLocalStorage } from "node:async_hooks";
import mongoose, { ClientSession } from "mongoose";

const transactionStorage = new AsyncLocalStorage<ClientSession>();

export function getTransactionSession(): ClientSession | undefined {
    return transactionStorage.getStore();
}

export async function runInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    if (transactionStorage.getStore()) return operation();
    if (mongoose.connection.readyState !== 1) {
        return operation();
    }

    return mongoose.connection.transaction(async (session) => transactionStorage.run(session, operation));
}
