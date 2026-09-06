import { randomUUID } from "node:crypto";
import { Server } from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { connectDatabase } from "../database/connection/connection.js";
import { reportError } from "../helpers/errorReporter.js";
import { logger } from "../helpers/logger.js";
import { connectBullMq } from "../infrastructure/bullmq.js";
import { connectRedis } from "../infrastructure/redis.js";
import { metricsRegistry, recordHttpMetrics } from "../helpers/metrics.js";
import { openApiDocument } from "../openapi.js";
import { pusherWebhookHandler } from "../realtime/webhookHandler.js";
import { router } from "../routes/index.js";
import { apiRateLimit } from "../security/rateLimitSecurity.js";
import { Environment, getEnvironment } from "./environment.js";
import { markApplicationInitialized, readinessSnapshot, resetReadiness } from "./readiness.js";

export function createApp(environment: Environment = getEnvironment()): Express {
    const app = express();

    app.disable("x-powered-by");
    if (environment.trustProxyHops > 0) {
        app.set("trust proxy", environment.trustProxyHops);
    }
    app.use(
        pinoHttp({
            logger,
            genReqId(request, response) {
                const incomingId = request.headers["x-request-id"];
                const requestId =
                    typeof incomingId === "string" && incomingId.length <= 128 ? incomingId : randomUUID();
                response.setHeader("x-request-id", requestId);
                return requestId;
            },
            quietReqLogger: true,
            autoLogging: {
                ignore: (request) => request.url?.startsWith("/health") ?? false,
            },
        }),
    );
    app.use(helmet());
    app.use(
        cors({
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
            origin(origin, callback) {
                if (
                    !origin ||
                    environment.corsOrigins.includes("*") ||
                    environment.corsOrigins.includes(origin)
                ) {
                    callback(null, true);
                    return;
                }
                callback(new Error("Origin is not allowed by CORS."));
            },
        }),
    );
    app.use(recordHttpMetrics);
    registerOperationalRoutes(app, environment);
    app.post(
        "/realtime/webhooks/pusher",
        apiRateLimit,
        express.raw({ type: "application/json", limit: "256kb" }),
        pusherWebhookHandler,
    );
    app.use(express.json({ limit: environment.jsonLimit }));
    app.use(express.urlencoded({ extended: false, limit: "64kb" }));
    app.use(cookieParser());
    app.use(apiRateLimit);
    app.get("/openapi.json", (_request, response) => response.json(openApiDocument));

    router(app);

    app.use((_request, response) => {
        response.status(404).json({ code: 404, message: "Route not found." });
    });

    app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
        reportError(error, { operation: "unhandledRequest" });
        const databaseError = error as { code?: number; name?: string };
        if (databaseError.code === 11000) {
            response
                .status(409)
                .json({ code: 409, message: "A resource with those unique values already exists." });
            return;
        }
        if (databaseError.name === "ValidationError" || databaseError.name === "CastError") {
            response.status(400).json({ code: 400, message: "Invalid request data." });
            return;
        }
        const message =
            environment.nodeEnv === "production"
                ? "Internal server error."
                : error instanceof Error
                  ? error.message
                  : "Internal server error.";
        response.status(500).json({ code: 500, message });
    });

    return app;
}

function registerOperationalRoutes(app: Express, environment: Environment): void {
    app.get("/health", (_request, response) => response.status(200).json({ status: "ok" }));
    app.get("/health/live", (_request, response) => response.status(200).json({ status: "ok" }));
    app.get("/health/ready", async (_request, response) => {
        const readiness = await readinessSnapshot(environment.processRole);
        response.status(readiness.status === "ready" ? 200 : 503).json(readiness);
    });
    app.get("/metrics", async (request, response) => {
        if (
            environment.metricsToken &&
            request.headers.authorization !== `Bearer ${environment.metricsToken}`
        ) {
            response.status(401).json({ code: 401, message: "Unauthorized." });
            return;
        }
        response.type(metricsRegistry.contentType).send(await metricsRegistry.metrics());
    });
}

export function createOperationalApp(environment: Environment = getEnvironment()): Express {
    const app = express();
    app.disable("x-powered-by");
    app.use(helmet());
    app.use(recordHttpMetrics);
    registerOperationalRoutes(app, environment);
    app.use((_request, response) => {
        response.status(404).json({ code: 404, message: "Route not found." });
    });
    return app;
}

export type ServerDependencies = {
    connect: (uri: string) => Promise<void>;
    connectRedis?: () => Promise<unknown>;
    connectBullMq?: () => Promise<unknown>;
};

export async function startServer(
    environment: Environment = getEnvironment(),
    dependencies: ServerDependencies = { connect: connectDatabase },
): Promise<Server> {
    await dependencies.connect(environment.mongoUri);
    const redisConnector =
        dependencies.connectRedis ?? (environment.nodeEnv === "test" ? async () => undefined : connectRedis);
    const bullMqConnector =
        dependencies.connectBullMq ??
        (environment.nodeEnv === "test" ? async () => undefined : connectBullMq);
    await redisConnector();
    await bullMqConnector();
    markApplicationInitialized();
    const app = createApp(environment);

    return new Promise((resolve) => {
        const server = app.listen(environment.port, () => resolve(server));
        server.once("close", () => {
            resetReadiness();
        });
        server.requestTimeout = 30_000;
        server.headersTimeout = 35_000;
    });
}

export default startServer;
