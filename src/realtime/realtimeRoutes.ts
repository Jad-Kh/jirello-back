import { Router } from "express";
import { CommunityQueries } from "../database/queries/community.js";
import { OutboxEventQueries } from "../database/queries/outbox.js";
import { ProjectQueries } from "../database/queries/project.js";
import { UserQueries } from "../database/queries/user.js";
import { hasPermission, Permissions } from "../helpers/permissions.js";
import { getUserEffectivePermissions } from "../security/permissionSecurity.js";
import { isCommunityMember } from "../security/resourceSecurity.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getEnvironment } from "../startup/environment.js";
import { parseChannelName } from "./channels.js";
import { getPusherClient } from "./pusherClient.js";

const realtimeRoutes = Router();
const socketPattern = /^\d+\.\d+$/;

realtimeRoutes.use(tokenSecurity);

realtimeRoutes.get("/config", (_request, response) => {
    const configuration = getEnvironment().pusher;
    if (!configuration) {
        response.status(503).json({ code: 503, message: "Realtime service is not configured." });
        return;
    }
    response.json({
        code: 200,
        message: "Realtime configuration loaded.",
        data: { key: configuration.key, cluster: configuration.cluster, forceTLS: configuration.useTls },
    });
});

realtimeRoutes.post("/user-auth", async (request, response, next) => {
    try {
        const socketId = String(request.body.socket_id ?? "");
        if (!socketPattern.test(socketId) || !request.userId) {
            response.status(400).json({ code: 400, message: "Invalid Pusher authentication request." });
            return;
        }
        const [pusher, user] = await Promise.all([
            Promise.resolve(getPusherClient()),
            UserQueries.getUserByIdQuery(request.userId),
        ]);
        if (!pusher || !user) {
            response.status(503).json({ code: 503, message: "Realtime service is unavailable." });
            return;
        }
        response.json(
            pusher.authenticateUser(socketId, {
                id: user.id,
                user_info: {
                    username: user.profile.username,
                    name: `${user.profile.firstName} ${user.profile.lastName}`,
                },
            }),
        );
    } catch (error) {
        next(error);
    }
});

realtimeRoutes.post("/channel-auth", async (request, response, next) => {
    try {
        const socketId = String(request.body.socket_id ?? "");
        const channelName = String(request.body.channel_name ?? "");
        const channel = parseChannelName(channelName);
        if (!socketPattern.test(socketId) || !channel || !request.userId) {
            response.status(403).json({ code: 403, message: "Realtime channel access denied." });
            return;
        }
        const pusher = getPusherClient();
        const user = await UserQueries.getUserByIdQuery(request.userId);
        if (!pusher || !user) {
            response.status(503).json({ code: 503, message: "Realtime service is unavailable." });
            return;
        }

        if (channel.kind === "user") {
            if (channel.id !== request.userId) {
                response.status(403).json({ code: 403, message: "Realtime channel access denied." });
                return;
            }
            response.json(pusher.authorizeChannel(socketId, channelName));
            return;
        }

        const project =
            channel.kind === "project" ? await ProjectQueries.getProjectByIdQuery(channel.id) : undefined;
        const communityId = channel.kind === "community" ? channel.id : project?.communityId;
        const community = communityId ? await CommunityQueries.getCommunityByIdQuery(communityId) : undefined;
        if (
            !community ||
            (project && project.communityId !== community.id) ||
            !isCommunityMember(community, user.id)
        ) {
            response.status(403).json({ code: 403, message: "Realtime channel access denied." });
            return;
        }
        if (project) {
            const permissions = await getUserEffectivePermissions(user, community);
            const requiredProjectPermissions = channel.presence
                ? [Permissions.READ_OWN, Permissions.READ_OTHER]
                : [Permissions.READ_OTHER];
            if (!hasPermission(permissions, "projects", requiredProjectPermissions)) {
                response.status(403).json({ code: 403, message: "Realtime channel access denied." });
                return;
            }
        }

        response.json(
            pusher.authorizeChannel(
                socketId,
                channelName,
                channel.presence
                    ? {
                          user_id: user.id,
                          user_info: {
                              username: user.profile.username,
                              name: `${user.profile.firstName} ${user.profile.lastName}`,
                          },
                      }
                    : undefined,
            ),
        );
    } catch (error) {
        next(error);
    }
});

realtimeRoutes.get("/outbox/dead", async (request, response, next) => {
    try {
        const user = await UserQueries.getUserByIdQuery(request.userId!);
        if (!user?.isAdmin) {
            response.status(403).json({ code: 403, message: "Administrator access required." });
            return;
        }
        const events = await OutboxEventQueries.getOutboxEventsQuery({ status: "dead" })
            .sort({ updatedAt: -1 })
            .limit(100);
        response.json({ code: 200, message: "Dead-letter events loaded.", data: events });
    } catch (error) {
        next(error);
    }
});

realtimeRoutes.post("/outbox/:eventId/retry", async (request, response, next) => {
    try {
        const user = await UserQueries.getUserByIdQuery(request.userId!);
        if (!user?.isAdmin) {
            response.status(403).json({ code: 403, message: "Administrator access required." });
            return;
        }
        const event = await OutboxEventQueries.claimOutboxEventQuery(
            { eventId: request.params.eventId, status: "dead" },
            { $set: { status: "pending", attempts: 0, availableAt: new Date() }, $unset: { lastError: 1 } },
            { new: true },
        );
        if (!event) {
            response.status(404).json({ code: 404, message: "Dead-letter event not found." });
            return;
        }
        response.json({ code: 200, message: "Realtime event queued for retry.", data: event });
    } catch (error) {
        next(error);
    }
});

export { realtimeRoutes };
