import { createHmac } from "node:crypto";
import mongoose from "mongoose";
import Pusher from "pusher";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CollaborationMessageModel } from "../src/database/models/collaboration/CollaborationMessage.js";
import { CommunityInvitationModel } from "../src/database/models/invitation/CommunityInvitation.js";
import { NotificationModel } from "../src/database/models/notification/Notification.js";
import { OutboxEventModel } from "../src/database/models/outbox/OutboxEvent.js";
import { ProjectModel } from "../src/database/models/project/Project.js";
import { TaskModel } from "../src/database/models/task/Task.js";
import { WorkConfigurationModel } from "../src/database/models/work/WorkConfiguration.js";
import { CommunityQueries } from "../src/database/queries/community.js";
import { ProjectQueries } from "../src/database/queries/project.js";
import { UserQueries } from "../src/database/queries/user.js";
import { publishUpcomingDeadlineNotifications } from "../src/workers/notification/deadlineWorker.js";
import { JWTkit } from "../src/helpers/jwtkit.js";
import { parseChannelName, RealtimeChannels } from "../src/realtime/channels.js";
import { enqueueRealtimeEvent } from "../src/realtime/events.js";
import { publishOutboxBatch } from "../src/realtime/outboxPublisher.js";
import * as PusherClient from "../src/realtime/pusherClient.js";
import { createApp } from "../src/startup/config.js";
import type { Environment } from "../src/startup/environment.js";

const userId = "507f1f77bcf86cd799439011";
const otherUserId = "507f1f77bcf86cd799439012";
const communityId = "507f191e810c19729de860ea";
const projectId = "507f1f77bcf86cd799439013";
const environment: Environment = {
    nodeEnv: "test",
    port: 0,
    mongoUri: "mongodb://127.0.0.1/test",
    redisUrl: "redis://127.0.0.1:6379",
    processRole: "api",
    instanceId: "realtime-test",
    accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenTtl: "10m",
    refreshTokenTtl: "7d",
    corsOrigins: ["*"],
    jsonLimit: "1mb",
    logLevel: "silent",
    passwordResetUrl: "http://localhost/reset",
    passwordResetTtlMinutes: 15,
    pusher: { appId: "app", key: "key", secret: "secret", cluster: "eu", useTls: true },
};
const permissions = {
    tasks: [1, 2, 3, 4],
    taskGroups: [1],
    meetings: [1],
    projects: [1, 2, 3, 4],
    screens: [1],
    roles: [1],
    users: [1],
    communities: [1],
};
const community = {
    id: communityId,
    ownerIds: [userId],
    userIds: [otherUserId],
    permissions,
    name: "Realtime Team",
};
const project = { id: projectId, communityId, organizerIds: [userId], userIds: [], updatedAt: new Date() };
const user = {
    id: userId,
    isAdmin: false,
    profile: { username: "owner", firstName: "Project", lastName: "Owner" },
    roles: { roleIds: [] },
};

const token = () => JWTkit.generateAccessToken(userId);

afterEach(() => vi.restoreAllMocks());

describe("realtime channel contracts", () => {
    it("creates and strictly parses tenant-scoped channel names", () => {
        expect(RealtimeChannels.user(userId)).toBe(`private-user-${userId}`);
        expect(parseChannelName(`presence-project-${projectId}`)).toEqual({
            kind: "project",
            id: projectId,
            presence: true,
        });
        expect(parseChannelName("private-project-not-an-id")).toBeUndefined();
    });

    it("rejects invalid event names and oversized payloads before publication", async () => {
        await expect(
            enqueueRealtimeEvent({
                channels: [RealtimeChannels.user(userId)],
                eventName: "invalid.event",
                aggregate: { type: "test", id: userId, version: 1 },
                data: {},
            }),
        ).rejects.toThrow("Invalid Pusher event name");
        await expect(
            enqueueRealtimeEvent({
                channels: [RealtimeChannels.user(userId)],
                eventName: "test-event-v1",
                aggregate: { type: "test", id: userId, version: 1 },
                data: { value: "x".repeat(10_000) },
            }),
        ).rejects.toThrow("payload exceeds");
    });

    it("authorizes project presence for members and rejects another user's channel", async () => {
        const authorizeChannel = vi.fn(() => ({ auth: "signed", channel_data: "member" }));
        const authenticateUser = vi.fn(() => ({
            auth: "user-signed",
            user_data: JSON.stringify({ id: userId }),
        }));
        vi.spyOn(PusherClient, "getPusherClient").mockReturnValue({
            authorizeChannel,
            authenticateUser,
        } as never);
        vi.spyOn(UserQueries, "getUserByIdQuery").mockResolvedValue(user as never);
        vi.spyOn(ProjectQueries, "getProjectByIdQuery").mockResolvedValue(project as never);
        vi.spyOn(CommunityQueries, "getCommunityByIdQuery").mockResolvedValue(community as never);

        await request(createApp(environment))
            .post("/realtime/user-auth")
            .set("Authorization", `Bearer ${token()}`)
            .send({ socket_id: "123.456" })
            .expect(200, { auth: "user-signed", user_data: JSON.stringify({ id: userId }) });
        expect(authenticateUser).toHaveBeenCalledOnce();

        await request(createApp(environment))
            .post("/realtime/channel-auth")
            .set("Authorization", `Bearer ${token()}`)
            .send({ socket_id: "123.456", channel_name: `presence-project-${projectId}` })
            .expect(200, { auth: "signed", channel_data: "member" });
        expect(authorizeChannel).toHaveBeenCalledOnce();

        await request(createApp(environment))
            .post("/realtime/channel-auth")
            .set("Authorization", `Bearer ${token()}`)
            .send({ socket_id: "123.456", channel_name: `private-user-${otherUserId}` })
            .expect(403);
    });

    it("accepts only verified, timely Pusher webhooks", async () => {
        const pusher = new Pusher({
            appId: "app",
            key: "key",
            secret: "secret",
            cluster: "eu",
            useTLS: true,
        });
        vi.spyOn(PusherClient, "getPusherClient").mockReturnValue(pusher);
        const body = JSON.stringify({
            time_ms: Date.now(),
            events: [{ name: "member_added", channel: `presence-project-${projectId}`, user_id: userId }],
        });
        const signature = createHmac("sha256", "secret").update(body).digest("hex");
        await request(createApp(environment))
            .post("/realtime/webhooks/pusher")
            .set("Content-Type", "application/json")
            .set("X-Pusher-Key", "key")
            .set("X-Pusher-Signature", signature)
            .send(body)
            .expect(204);
        await request(createApp(environment))
            .post("/realtime/webhooks/pusher")
            .set("Content-Type", "application/json")
            .set("X-Pusher-Key", "key")
            .set("X-Pusher-Signature", "invalid")
            .send(body)
            .expect(401);
    });
});

describe("realtime delivery", () => {
    it("publishes a claimed outbox event and marks it delivered", async () => {
        const trigger = vi.fn(async () => ({ ok: true, status: 200 }));
        vi.spyOn(PusherClient, "getPusherClient").mockReturnValue({ trigger } as never);
        vi.spyOn(OutboxEventModel, "findOneAndUpdate")
            .mockResolvedValueOnce({
                eventId: "event-1",
                channels: [`private-project-${projectId}`],
                eventName: "task-created-v1",
                payload: { eventId: "event-1" },
                attempts: 1,
            } as never)
            .mockResolvedValueOnce(null);
        const update = vi.spyOn(OutboxEventModel, "updateOne").mockResolvedValue({} as never);

        expect(await publishOutboxBatch()).toBe(1);
        expect(trigger).toHaveBeenCalledWith(
            [`private-project-${projectId}`],
            "task-created-v1",
            { eventId: "event-1" },
            { socket_id: undefined },
        );
        expect(update).toHaveBeenCalledOnce();
    });
});

describe("realtime business features", () => {
    it("creates a durable task and links it to the project", async () => {
        vi.spyOn(UserQueries, "getUserByIdQuery").mockResolvedValue(user as never);
        vi.spyOn(ProjectQueries, "getProjectByIdQuery").mockResolvedValue(project as never);
        vi.spyOn(CommunityQueries, "getCommunityByIdQuery").mockResolvedValue(community as never);
        vi.spyOn(WorkConfigurationModel, "findOne").mockReturnValue({
            sort: vi.fn().mockResolvedValue(null),
        } as never);
        const addTask = vi.spyOn(ProjectQueries, "addTaskToProjectQuery").mockResolvedValue({} as never);
        vi.spyOn(TaskModel.prototype, "save").mockImplementation(async function () {
            this._id = new mongoose.Types.ObjectId();
            return this;
        });

        const response = await request(createApp({ ...environment, pusher: undefined }))
            .post("/tasks")
            .set("Authorization", `Bearer ${token()}`)
            .send({ projectId, title: "Ship realtime", priority: "high", assigneeIds: [] })
            .expect(201);
        expect(response.body.data.title).toBe("Ship realtime");
        expect(addTask).toHaveBeenCalledOnce();
    });

    it("persists project chat messages", async () => {
        vi.spyOn(UserQueries, "getUserByIdQuery").mockResolvedValue(user as never);
        vi.spyOn(ProjectQueries, "getProjectByIdQuery").mockResolvedValue(project as never);
        vi.spyOn(CommunityQueries, "getCommunityByIdQuery").mockResolvedValue(community as never);
        vi.spyOn(CollaborationMessageModel.prototype, "save").mockImplementation(async function () {
            this._id = new mongoose.Types.ObjectId();
            return this;
        });

        const response = await request(createApp({ ...environment, pusher: undefined }))
            .post("/collaboration/messages")
            .set("Authorization", `Bearer ${token()}`)
            .send({ projectId, kind: "chat", body: "Realtime is live", mentionedUserIds: [] })
            .expect(201);
        expect(response.body.data.body).toBe("Realtime is live");
    });

    it("creates a durable community invitation and personal notification", async () => {
        vi.spyOn(UserQueries, "getUserByIdQuery").mockImplementation(async (id) =>
            id === userId
                ? (user as never)
                : ({ ...user, id: otherUserId, profile: { ...user.profile, username: "invitee" } } as never),
        );
        vi.spyOn(CommunityQueries, "getCommunityByIdQuery").mockResolvedValue({
            ...community,
            userIds: [],
        } as never);
        vi.spyOn(CommunityInvitationModel, "findOne").mockResolvedValue(null);
        vi.spyOn(CommunityInvitationModel, "updateMany").mockResolvedValue({} as never);
        vi.spyOn(CommunityInvitationModel.prototype, "save").mockImplementation(async function () {
            this._id = new mongoose.Types.ObjectId();
            return this;
        });
        vi.spyOn(NotificationModel.prototype, "save").mockImplementation(async function () {
            this._id = new mongoose.Types.ObjectId();
            return this;
        });

        const response = await request(createApp({ ...environment, pusher: undefined }))
            .post("/invitations")
            .set("Authorization", `Bearer ${token()}`)
            .send({ communityId, userId: otherUserId })
            .expect(201);
        expect(response.body.data.invitedUserId).toBe(otherUserId);
    });

    it("creates deduplicated notifications for tasks due within 24 hours", async () => {
        vi.spyOn(TaskModel, "find").mockReturnValue({
            limit: async () => [
                {
                    id: "507f1f77bcf86cd799439019",
                    title: "Due task",
                    projectId,
                    deadline: new Date(Date.now() + 60_000).toISOString(),
                    users: { userIds: [otherUserId] },
                },
            ],
        } as never);
        vi.spyOn(ProjectModel, "find").mockReturnValue({
            select: () => ({ lean: async () => [{ _id: projectId, communityId }] }),
        } as never);
        vi.spyOn(UserQueries, "getUserByIdQuery").mockResolvedValue({
            ...user,
            id: otherUserId,
            notifications: { muteAll: false, mutedCommunityIds: [], mutedChatIds: [] },
        } as never);
        const saveNotification = vi
            .spyOn(NotificationModel.prototype, "save")
            .mockImplementation(async function () {
                this._id = new mongoose.Types.ObjectId();
                return this;
            });

        expect(await publishUpcomingDeadlineNotifications()).toBe(1);
        expect(saveNotification).toHaveBeenCalledOnce();
    });
});
