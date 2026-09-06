import { resetEnvironmentCache } from "../src/startup/environment.js";

process.env.NODE_ENV = "test";
process.env.MONGO_CONNECT_URI = "mongodb://127.0.0.1:27017/jirello-test";
process.env.JWT_SECRET = "test-secret-that-is-at-least-thirty-two-characters";
process.env.JWT_ACCESS_SECRET = "test-access-secret-that-is-at-least-thirty-two-characters";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-that-is-at-least-thirty-two-characters";
process.env.ACCESS_TOKEN_TTL = "10m";
process.env.REFRESH_TOKEN_TTL = "7d";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.JSON_LIMIT = "1mb";
process.env.REDIS_URL = "redis://127.0.0.1:6379";

resetEnvironmentCache();
