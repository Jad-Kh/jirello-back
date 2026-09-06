import bcrypt from "bcrypt";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CommunityQueries } from "../src/database/queries/community.js";
import { RoleQueries } from "../src/database/queries/role.js";
import { UserQueries } from "../src/database/queries/user.js";
import { JWTkit } from "../src/helpers/jwtkit.js";
import { createApp, startServer } from "../src/startup/config.js";
import { Environment } from "../src/startup/environment.js";

const userId = "507f1f77bcf86cd799439011";
const communityId = "507f191e810c19729de860ea";

const testEnvironment: Environment = {
    nodeEnv: "test",
    port: 0,
    mongoUri: "mongodb://127.0.0.1:27017/test",
    redisUrl: "redis://127.0.0.1:6379",
    processRole: "api",
    instanceId: "app-test",
    accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenTtl: "10m",
    refreshTokenTtl: "7d",
    corsOrigins: ["http://localhost:3000"],
    jsonLimit: "1mb",
    logLevel: "silent",
    passwordResetUrl: "http://localhost/reset-password",
    passwordResetTtlMinutes: 15,
};

const profile = {
    username: "test-user",
    firstName: "Test",
    lastName: "User",
    birthday: "2000-01-01",
    email: "test@example.com",
    password: "",
};

function fakeUser(password = "hashed-password") {
    const value = {
        id: userId,
        profile: { ...profile, password },
        isAdmin: false,
        communityIds: [],
        ownedCommunityIds: [],
        tasks: { taskIds: [], taskGroupIds: [], taskPerWeekAverage: 0 },
        notifications: { mutedCommunityIds: [], mutedChatIds: [], muteAll: false },
        roles: { roleIds: [] },
        access: { refreshToken: "" },
    };
    return { ...value, toObject: () => value };
}

const defaultPermissions = {
    tasks: [1],
    taskGroups: [1],
    meetings: [1],
    projects: [1],
    screens: [1],
    roles: [1],
    users: [1],
    communities: [1],
};

function fakeCommunity(ownerIds: string[] = [userId]) {
    return {
        id: communityId,
        name: "Test Community",
        flag: "TEST",
        ownerIds,
        userIds: [],
        projectIds: [],
        template: "Normal",
        permissions: defaultPermissions,
        roleIds: [],
        screenIds: [],
        validationLevel: 0,
        requiredValidationLevel: 0,
    };
}

afterEach(() => vi.restoreAllMocks());

describe("application shell", () => {
    it("starts an HTTP server after its database dependency is ready", async () => {
        const connect = vi.fn(async () => undefined);
        const server = await startServer(testEnvironment, { connect });
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;

        await request(`http://127.0.0.1:${port}`).get("/health").expect(200, { status: "ok" });
        expect(connect).toHaveBeenCalledWith(testEnvironment.mongoUri);
        await new Promise<void>((resolve, reject) =>
            server.close((error) => (error ? reject(error) : resolve())),
        );
    });

    it("serves health and not-found responses", async () => {
        const app = createApp(testEnvironment);

        await request(app).get("/health").expect(200, { status: "ok" });
        await request(app).get("/health/live").expect(200, { status: "ok" });
        await request(app)
            .get("/health/ready")
            .expect(503, {
                status: "not-ready",
                role: "api",
                dependencies: {
                    application: false,
                    mongo: false,
                    redis: false,
                    bullmq: false,
                    worker: "not-required",
                },
            });
        const contract = await request(app).get("/openapi.json").expect(200);
        expect(contract.body.openapi).toBe("3.1.0");
        const metrics = await request(app).get("/metrics").expect(200);
        expect(metrics.text).toContain("jirello_http_request_duration_seconds");
        await request(app).get("/missing").expect(404, { code: 404, message: "Route not found." });
    });

    it("allows configured origins and rejects other origins", async () => {
        const app = createApp(testEnvironment);

        await request(app)
            .get("/health")
            .set("Origin", "http://localhost:3000")
            .expect("access-control-allow-origin", "http://localhost:3000")
            .expect(200);
        await request(app).get("/health").set("Origin", "https://untrusted.example").expect(500);
    });
});

describe("authentication routes", () => {
    it("registers a user, hashes the password, and sets a hardened refresh cookie", async () => {
        vi.spyOn(UserQueries, "getUserByEmailQuery").mockResolvedValue(null);
        vi.spyOn(UserQueries, "getUserByUsernameQuery").mockResolvedValue(null);
        const createdUser = fakeUser();
        const createUser = vi.spyOn(UserQueries, "createUserQuery").mockResolvedValue(createdUser as any);
        const updateAccess = vi.spyOn(UserQueries, "updateUserAccessQuery").mockResolvedValue({} as any);

        const response = await request(createApp(testEnvironment))
            .post("/auth/sign-up")
            .send({
                ...profile,
                password: "correct-horse-battery-staple",
            })
            .expect(201);

        expect(createUser).toHaveBeenCalledOnce();
        const persisted = createUser.mock.calls[0]![0];
        expect(persisted.profile.password).not.toBe("correct-horse-battery-staple");
        expect(await bcrypt.compare("correct-horse-battery-staple", persisted.profile.password)).toBe(true);
        expect(updateAccess.mock.calls[0]![1]).toMatch(/^[a-f0-9]{64}$/);
        expect(response.body.data.user.profile.password).toBeUndefined();
        expect(response.body.data.accessToken).toEqual(expect.any(String));
        expect(response.headers["set-cookie"]?.[0]).toContain("HttpOnly");
        expect(response.headers["set-cookie"]?.[0]).toContain("SameSite=Strict");
    });

    it("rejects duplicate accounts before creating a user", async () => {
        vi.spyOn(UserQueries, "getUserByEmailQuery").mockResolvedValue(fakeUser() as any);
        vi.spyOn(UserQueries, "getUserByUsernameQuery").mockResolvedValue(null);
        const createUser = vi.spyOn(UserQueries, "createUserQuery");

        await request(createApp(testEnvironment))
            .post("/auth/sign-up")
            .send({
                ...profile,
                password: "correct-horse-battery-staple",
            })
            .expect(400);

        expect(createUser).not.toHaveBeenCalled();
    });

    it("logs in with an email and never returns the password", async () => {
        const password = await bcrypt.hash("correct-password", 4);
        vi.spyOn(UserQueries, "getUserByEmailQuery").mockResolvedValue(fakeUser(password) as any);
        vi.spyOn(UserQueries, "updateUserAccessQuery").mockResolvedValue({} as any);

        const response = await request(createApp(testEnvironment))
            .post("/auth/log-in")
            .send({
                usernameOrEmail: profile.email,
                password: "correct-password",
            })
            .expect(200);

        expect(response.body.data.accessToken).toEqual(expect.any(String));
        expect(JSON.stringify(response.body)).not.toContain(password);
    });

    it("rotates a valid refresh token and rejects a mismatched token", async () => {
        const refreshToken = JWTkit.generateRefreshToken(userId);
        vi.spyOn(UserQueries, "getUserAccessByIdQuery").mockResolvedValue({
            access: { refreshToken: JWTkit.hashToken(refreshToken) },
        } as any);
        const updateAccess = vi.spyOn(UserQueries, "updateUserAccessQuery").mockResolvedValue({} as any);

        const response = await request(createApp(testEnvironment))
            .post("/auth/refresh-token")
            .set("Cookie", `refreshToken=${refreshToken}`)
            .expect(200);

        expect(JWTkit.verifyAccessToken(response.body.data.token).sub).toBe(userId);
        expect(updateAccess).toHaveBeenCalledOnce();

        vi.restoreAllMocks();
        vi.spyOn(UserQueries, "getUserAccessByIdQuery").mockResolvedValue({
            access: { refreshToken: JWTkit.hashToken(JWTkit.generateRefreshToken(userId)) },
        } as any);
        await request(createApp(testEnvironment))
            .post("/auth/refresh-token")
            .set("Cookie", `refreshToken=${refreshToken}`)
            .expect(401);
    });

    it("revokes the stored refresh token during logout", async () => {
        const removeAccess = vi.spyOn(UserQueries, "removeUserAccessQuery").mockResolvedValue({} as any);
        const accessToken = JWTkit.generateAccessToken(userId);

        const response = await request(createApp(testEnvironment))
            .post("/auth/log-out")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);

        expect(removeAccess).toHaveBeenCalledWith(userId);
        expect(response.headers["set-cookie"]?.[0]).toContain("refreshToken=");
    });

    it("keeps recovery enumeration-safe and consumes reset tokens atomically", async () => {
        vi.spyOn(UserQueries, "getUserByEmailQuery").mockResolvedValue(null);
        await request(createApp(testEnvironment))
            .post("/auth/recovery-email")
            .send({ email: "missing@example.com" })
            .expect(202, {
                code: 202,
                message: "If the account exists, password reset instructions will be sent.",
            });

        const reset = vi.spyOn(UserQueries, "resetPasswordQuery").mockResolvedValue(fakeUser() as any);
        await request(createApp(testEnvironment))
            .post("/auth/reset-password")
            .send({ token: "a".repeat(32), password: "new-secure-password" })
            .expect(200);
        expect(reset.mock.calls[0]![0]).toMatch(/^[a-f0-9]{64}$/);
        expect(await bcrypt.compare("new-secure-password", reset.mock.calls[0]![1])).toBe(true);
    });
});

describe("community authorization", () => {
    it("rejects authenticated users who are not community members", async () => {
        vi.spyOn(CommunityQueries, "getCommunityByIdQuery").mockResolvedValue(fakeCommunity([]) as any);
        vi.spyOn(UserQueries, "getUserByIdQuery").mockResolvedValue(fakeUser() as any);
        const update = vi.spyOn(CommunityQueries, "updateCommunityQuery");

        await request(createApp(testEnvironment))
            .put(`/communities/update-community/${communityId}`)
            .set("Authorization", `Bearer ${JWTkit.generateAccessToken(userId)}`)
            .send({ name: "Updated Community" })
            .expect(403);

        expect(update).not.toHaveBeenCalled();
    });

    it("allows an owner to update their community", async () => {
        const community = fakeCommunity();
        vi.spyOn(CommunityQueries, "getCommunityByIdQuery").mockResolvedValue(community as any);
        vi.spyOn(UserQueries, "getUserByIdQuery").mockResolvedValue(fakeUser() as any);
        vi.spyOn(RoleQueries, "getRolesOfUserInCommunityQuery").mockResolvedValue([]);
        vi.spyOn(CommunityQueries, "updateCommunityQuery").mockResolvedValue({
            ...community,
            name: "Updated Community",
        } as any);

        const response = await request(createApp(testEnvironment))
            .put(`/communities/update-community/${communityId}`)
            .set("Authorization", `Bearer ${JWTkit.generateAccessToken(userId)}`)
            .send({ name: "Updated Community" })
            .expect(200);

        expect(response.body.data.name).toBe("Updated Community");
    });
});
