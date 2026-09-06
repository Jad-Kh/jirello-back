import "dotenv/config";
import mongoose from "mongoose";
import { ensureDatabaseIndexes } from "../database/indexes.js";
import { logger } from "../helpers/logger.js";
import { parseScaleSeedOptions, profileTotals } from "./seedScale/config.js";
import { generateScaleData, scaleSeedCollections } from "./seedScale/generateScaleData.js";
import { removeSeedRun } from "./seedScale/writer.js";

const uri = process.env.MONGO_CONNECT_URI ?? "mongodb://127.0.0.1:27018/jirello?directConnection=true";
const options = parseScaleSeedOptions(process.argv.slice(2));

function assertScaleSeedAllowed() {
    if (process.env.ALLOW_SCALE_SEED !== "true") {
        throw new Error("Scale seeding is disabled. Set ALLOW_SCALE_SEED=true explicitly.");
    }
    if (process.env.NODE_ENV === "production") {
        throw new Error("Scale seeding is never allowed while NODE_ENV=production.");
    }

    const parsed = new URL(uri);
    const hosts = parsed.host
        .split(",")
        .map((host) => host.split(":")[0]?.toLowerCase())
        .filter(Boolean);
    const localHosts = new Set(["localhost", "127.0.0.1", "::1", "mongo"]);
    const isLocal = hosts.length > 0 && hosts.every((host) => localHosts.has(host!));
    if (!isLocal && process.env.ALLOW_REMOTE_SCALE_SEED !== "true") {
        throw new Error(
            "Scale seeding only targets local Docker/localhost by default. Set ALLOW_REMOTE_SCALE_SEED=true for an intentional non-production remote database.",
        );
    }
}

async function main() {
    assertScaleSeedAllowed();
    logger.info(
        {
            runId: options.runId,
            profile: options.profileName,
            totals: profileTotals(options.profile),
            anchor: options.anchor,
            batchSize: options.batchSize,
        },
        "Starting deterministic scale seed",
    );

    await mongoose.connect(uri);
    const databaseName = mongoose.connection.name;
    if (["admin", "config", "local"].includes(databaseName)) {
        throw new Error(`Refusing to seed protected MongoDB database "${databaseName}".`);
    }

    const manifests = mongoose.connection.collection("seedRuns");
    const existing = await manifests.findOne({ runId: options.runId });
    if (existing && !options.reset) {
        throw new Error(`Seed run "${options.runId}" already exists. Pass --reset to replace only that run.`);
    }
    if (options.reset) {
        logger.info({ runId: options.runId }, "Removing previous documents for this seed run");
        await removeSeedRun(scaleSeedCollections, options.runId);
        await manifests.deleteOne({ runId: options.runId });
    }

    await ensureDatabaseIndexes();
    await manifests.insertOne({
        runId: options.runId,
        profile: options.profileName,
        seed: options.seed,
        anchor: options.anchor,
        totals: profileTotals(options.profile),
        status: "running",
        startedAt: new Date(),
    });

    try {
        const result = await generateScaleData(options, (domain, count) => {
            logger.info({ runId: options.runId, domain, count }, "Scale seed domain completed");
        });
        await manifests.updateOne(
            { runId: options.runId },
            { $set: { status: "completed", completedAt: new Date() } },
        );
        logger.info(
            {
                runId: options.runId,
                database: databaseName,
                ...result,
            },
            "Scale seed completed",
        );
    } catch (error) {
        await manifests.updateOne(
            { runId: options.runId },
            {
                $set: {
                    status: "failed",
                    failedAt: new Date(),
                    failure: error instanceof Error ? error.message : String(error),
                },
            },
        );
        throw error;
    }
}

main()
    .catch((error) => {
        logger.fatal({ err: error, runId: options.runId }, "Scale seed failed");
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
