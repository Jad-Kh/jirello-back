import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CommunityQueries } from "../src/database/queries/community.js";
import { ProjectQueries } from "../src/database/queries/project.js";
import { RoleQueries } from "../src/database/queries/role.js";
import { UserQueries } from "../src/database/queries/user.js";
import { JWTkit } from "../src/helpers/jwtkit.js";
import { createApp } from "../src/startup/config.js";
import { Environment } from "../src/startup/environment.js";

const userId = "507f1f77bcf86cd799439011";
const communityId = "507f191e810c19729de860ea";

const token = () => JWTkit.generateAccessToken(userId);

const environment: Environment = {
    nodeEnv: "test",
    port: 0,
    mongoUri: "mongodb://127.0.0.1:27017/test",
    redisUrl: "redis://127.0.0.1:6379",
    processRole: "api",
    instanceId: "features-test",
    accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenTtl: "10m",
    refreshTokenTtl: "7d",
    corsOrigins: ["*"],
    jsonLimit: "1mb",
    logLevel: "silent",
    passwordResetUrl: "http://localhost/reset-password",
    passwordResetTtlMinutes: 15,
};

const permissions = {
    tasks: [1],
    taskGroups: [1],
    meetings: [1],
    projects: [1],
    screens: [1],
    roles: [1],
    users: [1],
    communities: [1],
};
const community = {
    id: communityId,
    name: "Feature Community",
    flag: "FEAT",
    ownerIds: [userId],
    userIds: [],
    projectIds: [],
    template: "Normal",
    permissions,
    roleIds: [],
    screenIds: [],
    validationLevel: 0,
    requiredValidationLevel: 0,
};
const user = {
    id: userId,
    profile: {
        username: "feature-user",
        firstName: "Feature",
        lastName: "User",
        birthday: "2000-01-01",
        email: "feature@example.com",
        password: "hashed",
    },
    isAdmin: false,
    communityIds: [],
    ownedCommunityIds: [communityId],
    tasks: { taskIds: [], taskGroupIds: [], taskPerWeekAverage: 0 },
    notifications: { mutedCommunityIds: [], mutedChatIds: [], muteAll: false },
    roles: { roleIds: [] },
};

function authorizeOwner(): void {
    vi.spyOn(CommunityQueries, "getCommunityByIdQuery").mockResolvedValue(community as any);
    vi.spyOn(UserQueries, "getUserByIdQuery").mockResolvedValue(user as any);
}

afterEach(() => vi.restoreAllMocks());

describe("feature route composition", () => {
    it.each([
        ["post", "/projects/create-project"],
        ["post", "/roles/create-role"],
        ["get", `/users/get-user-by-id/${userId}`],
        ["get", `/communities/get-user-communities/${userId}`],
    ] as const)("protects %s %s", async (method, path) => {
        await request(createApp(environment))[method](path).expect(401);
    });

    it("rejects invalid project input before calling persistence", async () => {
        const createProject = vi.spyOn(ProjectQueries, "createProjectQuery");

        await request(createApp(environment))
            .post("/projects/create-project")
            .set("Authorization", `Bearer ${token()}`)
            .send({ name: "x", communityId: "invalid" })
            .expect(400);

        expect(createProject).not.toHaveBeenCalled();
    });

    it("creates a project with the authenticated user as organizer", async () => {
        authorizeOwner();
        vi.spyOn(ProjectQueries, "getProjectByNameQuery").mockResolvedValue(null);
        const createProject = vi.spyOn(ProjectQueries, "createProjectQuery").mockImplementation(
            async (project) =>
                ({
                    ...project,
                    id: "507f1f77bcf86cd799439012",
                    _id: { toString: () => "507f1f77bcf86cd799439012" },
                }) as any,
        );
        const addProject = vi
            .spyOn(CommunityQueries, "addProjectToCommunityQuery")
            .mockResolvedValue({} as any);

        const response = await request(createApp(environment))
            .post("/projects/create-project")
            .set("Authorization", `Bearer ${token()}`)
            .send({ name: "Roadmap", communityId })
            .expect(201);

        expect(createProject.mock.calls[0]![0].organizerIds).toEqual([userId]);
        expect(addProject).toHaveBeenCalledWith(communityId, "507f1f77bcf86cd799439012");
        expect(response.body.data.name).toBe("Roadmap");
    });

    it("creates a role and links it back to the community", async () => {
        authorizeOwner();
        vi.spyOn(RoleQueries, "getRoleByTitleQuery").mockResolvedValue(null);
        vi.spyOn(RoleQueries, "createRoleQuery").mockImplementation(
            async (role) =>
                ({
                    ...role,
                    id: "507f1f77bcf86cd799439013",
                }) as any,
        );
        const linkRole = vi.spyOn(CommunityQueries, "addRoleToCommunityQuery").mockResolvedValue({} as any);

        const response = await request(createApp(environment))
            .post("/roles/create-role")
            .set("Authorization", `Bearer ${token()}`)
            .send({ title: "Maintainer", communityId, priorityPosition: 1 })
            .expect(201);

        expect(linkRole).toHaveBeenCalledWith(communityId, "507f1f77bcf86cd799439013");
        expect(response.body.data.title).toBe("Maintainer");
    });

    it("returns a sanitized user only inside the active community", async () => {
        authorizeOwner();

        const response = await request(createApp(environment))
            .get(`/users/get-user-by-id/${userId}`)
            .set("Authorization", `Bearer ${token()}`)
            .set("activeCommunityId", communityId)
            .expect(200);

        expect(response.body.data.profile.email).toBe("feature@example.com");
        expect(response.body.data.profile.password).toBeUndefined();
    });
});
