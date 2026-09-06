import mongoose from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { connectDatabase, disconnectDatabase } from "../../src/database/connection/connection.js";
import { ensureDatabaseIndexes } from "../../src/database/indexes.js";
import { CommunityInvitationModel } from "../../src/database/models/invitation/CommunityInvitation.js";
import { CommunityModel } from "../../src/database/models/community/Community.js";
import { OutboxEventModel } from "../../src/database/models/outbox/OutboxEvent.js";
import { TaskModel } from "../../src/database/models/task/Task.js";
import type { IUser } from "../../src/database/models/user/IUser.js";
import { UserModel } from "../../src/database/models/user/User.js";
import { UserQueries } from "../../src/database/queries/user.js";
import { getTransactionSession, runInTransaction } from "../../src/database/transaction.js";

const mongoUri = process.env.TEST_MONGO_URI;
const describeDatabase = mongoUri ? describe : describe.skip;

const user = (email: string, username: string) => ({
    profile: {
        email,
        username,
        firstName: "Test",
        lastName: "User",
        birthday: "2000-01-01",
        password: "password-hash",
    },
});

describeDatabase("MongoDB integration", () => {
    beforeAll(async () => {
        await connectDatabase(mongoUri!);
        await mongoose.connection.db!.dropDatabase();
        await ensureDatabaseIndexes();
    });

    afterAll(async () => {
        await mongoose.connection.db?.dropDatabase();
        await disconnectDatabase();
    });

    it("enforces unique identity indexes", async () => {
        await UserModel.create(user("unique@example.com", "unique-user"));
        await expect(UserModel.create(user("unique@example.com", "another-user"))).rejects.toMatchObject({
            code: 11000,
        });
    });

    it("rolls back failed multi-document work", async () => {
        await expect(
            runInTransaction(async () => {
                await UserQueries.createUserQuery(user("rollback@example.com", "rollback-user") as IUser);
                throw new Error("rollback");
            }),
        ).rejects.toThrow("rollback");
        expect(await UserModel.exists({ "profile.email": "rollback@example.com" })).toBeNull();
    });

    it("rolls back the real community creation writes together", async () => {
        const owner = await UserModel.create(user("community-owner@example.com", "community-owner"));

        await expect(
            runInTransaction(async () => {
                const community = await new CommunityModel({
                    name: "Rollback community",
                    flag: "ROLLBACK-COMMUNITY",
                    ownerIds: [owner.id],
                }).save({ session: getTransactionSession() });
                await UserQueries.addCommunityToUserOwnedQuery(owner.id, community.id);
                throw new Error("fail-after-community-and-owner-update");
            }),
        ).rejects.toThrow("fail-after-community-and-owner-update");

        expect(await CommunityModel.exists({ flag: "ROLLBACK-COMMUNITY" })).toBeNull();
        const ownerAfterRollback = await UserModel.findById(owner.id);
        expect(ownerAfterRollback?.ownedCommunityIds).toEqual([]);
    });

    it("rolls back realtime outbox records with their business transaction", async () => {
        await expect(
            runInTransaction(async () => {
                await new OutboxEventModel({
                    eventId: "rollback-event",
                    channels: ["private-user-507f1f77bcf86cd799439011"],
                    eventName: "test-event-v1",
                    payload: { eventId: "rollback-event" },
                }).save({ session: getTransactionSession() });
                throw new Error("rollback-outbox");
            }),
        ).rejects.toThrow("rollback-outbox");
        expect(await OutboxEventModel.exists({ eventId: "rollback-event" })).toBeNull();
    });

    it("prevents concurrent duplicate pending community invitations", async () => {
        const invitation = {
            communityId: "507f191e810c19729de860ea",
            invitedUserId: "507f1f77bcf86cd799439011",
            invitedBy: "507f1f77bcf86cd799439012",
            expiresAt: new Date(Date.now() + 60_000),
        };
        await CommunityInvitationModel.create(invitation);
        await expect(CommunityInvitationModel.create(invitation)).rejects.toMatchObject({ code: 11000 });
    });

    it("lets the database resolve concurrent task requests with the same idempotency key", async () => {
        const idempotentTask = {
            title: "Only one task",
            priority: "medium",
            deadline: "Unlimited",
            projectId: "507f191e810c19729de860ea",
            status: "todo",
            users: {
                createdBy: "507f1f77bcf86cd799439011",
                reviewer: "507f1f77bcf86cd799439011",
                userIds: [],
            },
            idempotencyKey: "same-browser-request",
            requestHash: "same-payload-hash",
        };
        const attempts = await Promise.allSettled([
            TaskModel.create(idempotentTask),
            TaskModel.create(idempotentTask),
        ]);

        expect(attempts.filter((attempt) => attempt.status === "fulfilled")).toHaveLength(1);
        expect(attempts.filter((attempt) => attempt.status === "rejected")).toHaveLength(1);
        expect(await TaskModel.countDocuments({ idempotencyKey: "same-browser-request" })).toBe(1);
    });
});
