import { describe, expect, it } from "vitest";
import { CommunityModel } from "../src/database/models/community/Community.js";
import { ProjectModel } from "../src/database/models/project/Project.js";
import { RoleModel } from "../src/database/models/role/Role.js";
import { UserModel } from "../src/database/models/user/User.js";

describe("database schemas", () => {
    it("creates safe defaults for new users", async () => {
        const user = new UserModel({
            profile: {
                username: "schema-user",
                firstName: "Schema",
                lastName: "User",
                birthday: "2000-01-01",
                email: "SCHEMA@EXAMPLE.COM",
                password: "hashed-password",
            },
        });

        await user.validate();
        expect(user.profile.email).toBe("schema@example.com");
        expect(user.communityIds).toEqual([]);
        expect(user.roles?.roleIds).toEqual([]);
        expect(user.access?.refreshToken).toBe("");
    });

    it("creates community permission defaults for every domain", async () => {
        const community = new CommunityModel({
            name: "Schema Community",
            flag: "sc",
            ownerIds: ["507f1f77bcf86cd799439011"],
        });

        await community.validate();
        expect(community.flag).toBe("SC");
        expect(community.permissions.users).toEqual([1]);
        expect(community.permissions.communities).toEqual([1]);
    });

    it("defines uniqueness within the intended resource scope", () => {
        expect(UserModel.schema.indexes()).toEqual(
            expect.arrayContaining([
                [{ "profile.email": 1 }, expect.objectContaining({ unique: true })],
                [{ "profile.username": 1 }, expect.objectContaining({ unique: true })],
            ]),
        );
        expect(ProjectModel.schema.indexes()).toContainEqual([
            { communityId: 1, name: 1 },
            expect.objectContaining({ unique: true }),
        ]);
        expect(RoleModel.schema.indexes()).toContainEqual([
            { communityId: 1, title: 1 },
            expect.objectContaining({ unique: true }),
        ]);
    });
});
