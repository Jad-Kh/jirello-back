import mongoose from "mongoose";
import { getEnvironment } from "../../startup/environment.js";

export async function connectDatabase(uri: string): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
        return;
    }

    await mongoose.connect(uri, { autoIndex: getEnvironment().nodeEnv !== "production" });
}

export async function disconnectDatabase(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
}

export default connectDatabase;
