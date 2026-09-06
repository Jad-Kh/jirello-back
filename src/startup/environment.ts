import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

export type Environment = {
    nodeEnv: "development" | "test" | "production";
    port: number;
    mongoUri: string;
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenTtl: string;
    refreshTokenTtl: string;
    corsOrigins: string[];
    jsonLimit: string;
    trustProxyHops: number;
    logLevel: string;
    redisUrl: string;
    processRole: "api" | "queue-worker" | "scheduler" | "outbox-worker" | "all";
    instanceId: string;
    passwordResetUrl: string;
    passwordResetTtlMinutes: number;
    metricsToken?: string;
    sentryDsn?: string;
    pusher?: {
        appId: string;
        key: string;
        secret: string;
        cluster: string;
        useTls: boolean;
    };
    smtp?: {
        host: string;
        port: number;
        secure: boolean;
        user?: string;
        password?: string;
        from: string;
    };
};

const environmentSchema = Joi.object({
    NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
    PORT: Joi.number().port().default(8082),
    MONGO_CONNECT_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().min(16).required(),
    JWT_ACCESS_SECRET: Joi.string().min(16),
    JWT_REFRESH_SECRET: Joi.string().min(16),
    ACCESS_TOKEN_TTL: Joi.string().default("10m"),
    REFRESH_TOKEN_TTL: Joi.string().default("7d"),
    CORS_ORIGIN: Joi.string().default("http://localhost:3000"),
    JSON_LIMIT: Joi.string().default("1mb"),
    TRUST_PROXY_HOPS: Joi.number().integer().min(0).max(10).default(0),
    LOG_LEVEL: Joi.string()
        .valid("fatal", "error", "warn", "info", "debug", "trace", "silent")
        .default("info"),
    REDIS_URL: Joi.string()
        .uri({ scheme: ["redis", "rediss"] })
        .required(),
    PROCESS_ROLE: Joi.string()
        .valid("api", "queue-worker", "scheduler", "outbox-worker", "all")
        .default("all"),
    INSTANCE_ID: Joi.string().trim().min(1).max(128),
    PASSWORD_RESET_URL: Joi.string().uri().default("http://localhost:3000/reset-password"),
    PASSWORD_RESET_TTL_MINUTES: Joi.number().integer().min(5).max(60).default(15),
    SMTP_HOST: Joi.string(),
    SMTP_PORT: Joi.number().port().default(587),
    SMTP_SECURE: Joi.boolean().default(false),
    SMTP_USER: Joi.string(),
    SMTP_PASSWORD: Joi.string(),
    SMTP_FROM: Joi.string().email(),
    METRICS_TOKEN: Joi.string().min(32),
    SENTRY_DSN: Joi.string().uri(),
    PUSHER_APP_ID: Joi.string(),
    PUSHER_KEY: Joi.string(),
    PUSHER_SECRET: Joi.string(),
    PUSHER_CLUSTER: Joi.string(),
    PUSHER_USE_TLS: Joi.boolean().default(true),
})
    .and("PUSHER_APP_ID", "PUSHER_KEY", "PUSHER_SECRET", "PUSHER_CLUSTER")
    .unknown(true);

let cachedEnvironment: Environment | undefined;

export function getEnvironment(source: NodeJS.ProcessEnv = process.env): Environment {
    if (source === process.env && cachedEnvironment) {
        return cachedEnvironment;
    }

    const { error, value } = environmentSchema.validate(source, {
        abortEarly: false,
        stripUnknown: false,
    });

    if (error) {
        throw new Error(`Invalid environment configuration: ${error.message}`);
    }

    if (
        value.NODE_ENV === "production" &&
        (!value.SMTP_HOST ||
            !value.SMTP_FROM ||
            !value.REDIS_URL ||
            !value.METRICS_TOKEN ||
            !value.PUSHER_APP_ID ||
            !value.PUSHER_KEY ||
            !value.PUSHER_SECRET ||
            !value.PUSHER_CLUSTER)
    ) {
        throw new Error(
            "Invalid environment configuration: SMTP, Redis, metrics, and Pusher credentials are required in production.",
        );
    }
    if (value.NODE_ENV === "production" && value.PROCESS_ROLE === "all") {
        throw new Error(
            "Invalid environment configuration: PROCESS_ROLE must select one dedicated production role.",
        );
    }
    if ((value.SMTP_USER && !value.SMTP_PASSWORD) || (!value.SMTP_USER && value.SMTP_PASSWORD)) {
        throw new Error(
            "Invalid environment configuration: SMTP_USER and SMTP_PASSWORD must be provided together.",
        );
    }

    const environment: Environment = {
        nodeEnv: value.NODE_ENV as Environment["nodeEnv"],
        port: value.PORT as number,
        mongoUri: value.MONGO_CONNECT_URI as string,
        accessTokenSecret: (value.JWT_ACCESS_SECRET ?? value.JWT_SECRET) as string,
        refreshTokenSecret: (value.JWT_REFRESH_SECRET ?? value.JWT_SECRET) as string,
        accessTokenTtl: value.ACCESS_TOKEN_TTL as string,
        refreshTokenTtl: value.REFRESH_TOKEN_TTL as string,
        corsOrigins: (value.CORS_ORIGIN as string).split(",").map((origin) => origin.trim()),
        jsonLimit: value.JSON_LIMIT as string,
        trustProxyHops: value.TRUST_PROXY_HOPS as number,
        logLevel: value.LOG_LEVEL as string,
        redisUrl: value.REDIS_URL as string,
        processRole: value.PROCESS_ROLE as Environment["processRole"],
        instanceId: (value.INSTANCE_ID ?? source.HOSTNAME ?? `node-${process.pid}`) as string,
        passwordResetUrl: value.PASSWORD_RESET_URL as string,
        passwordResetTtlMinutes: value.PASSWORD_RESET_TTL_MINUTES as number,
        metricsToken: value.METRICS_TOKEN as string | undefined,
        sentryDsn: value.SENTRY_DSN as string | undefined,
        pusher: value.PUSHER_APP_ID
            ? {
                  appId: value.PUSHER_APP_ID as string,
                  key: value.PUSHER_KEY as string,
                  secret: value.PUSHER_SECRET as string,
                  cluster: value.PUSHER_CLUSTER as string,
                  useTls: value.PUSHER_USE_TLS as boolean,
              }
            : undefined,
        smtp: value.SMTP_HOST
            ? {
                  host: value.SMTP_HOST as string,
                  port: value.SMTP_PORT as number,
                  secure: value.SMTP_SECURE as boolean,
                  user: value.SMTP_USER as string | undefined,
                  password: value.SMTP_PASSWORD as string | undefined,
                  from: value.SMTP_FROM as string,
              }
            : undefined,
    };

    if (source === process.env) {
        cachedEnvironment = environment;
    }

    return environment;
}

export function resetEnvironmentCache(): void {
    cachedEnvironment = undefined;
}
