import { CollaborationMessageQueries } from "../../../database/queries/collaboration.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateMessageRequest } from "./updateMessageRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import { resolveScope, socketId } from "../../../services/collaboration/collaborationService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CollaborationErrorResponses } from "../../../responses/errors/CollaborationErrorResponses.js";

export async function updateMessageHandler(
    request: IRequest<UpdateMessageRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        if (!/^[a-f\d]{24}$/i.test(request.params.id)) {
            response.status(400).json({ ...CollaborationErrorResponses.INVALID_MESSAGE_ID });
            return;
        }
        const value = request.requestModel!;
        const current = await CollaborationMessageQueries.getCollaborationMessageByIdQuery(request.params.id);
        if (!current) {
            response.status(404).json({ ...CollaborationErrorResponses.MESSAGE_NOT_FOUND });
            return;
        }
        const context = await resolveScope(request.userId!, {
            projectId: current.projectId,
            communityId: current.projectId ? undefined : current.communityId,
        });
        const moderator =
            context &&
            (context.user.isAdmin ||
                context.community.ownerIds.map(String).includes(request.userId!) ||
                context.project?.organizerIds.map(String).includes(request.userId!));
        if (!context || (current.authorId !== request.userId! && !moderator)) {
            response.status(403).json({ ...CollaborationErrorResponses.MESSAGE_UPDATE_DENIED });
            return;
        }
        const memberIds = new Set([...context.community.ownerIds, ...context.community.userIds].map(String));
        if (value.mentionedUserIds?.some((candidate: string) => !memberIds.has(candidate))) {
            response
                .status(400)
                .json({ ...CollaborationErrorResponses.MENTIONED_USERS_MUST_BELONG_TO_THE_COMMUNITY });
            return;
        }
        const previousMentions = new Set(current.mentionedUserIds);
        const updated = await runInTransaction(async () => {
            const saved = await CollaborationMessageQueries.updateCollaborationMessageQuery(
                { _id: current.id, version: value.version, deletedAt: { $exists: false } },
                {
                    $set: {
                        body: value.body,
                        editedAt: new Date(),
                        ...(value.mentionedUserIds ? { mentionedUserIds: value.mentionedUserIds } : {}),
                    },
                    $inc: { version: 1 },
                },
                { new: true, session: getTransactionSession() },
            );
            if (saved) {
                await enqueueRealtimeEvent({
                    channels: [context.channel],
                    eventName: saved.kind === "chat" ? "chat-message-updated-v1" : "comment-updated-v1",
                    actorId: request.userId!,
                    aggregate: { type: saved.kind, id: saved.id, version: saved.version },
                    data: { message: saved.toObject({ virtuals: true }) },
                    socketId: socketId(request.header("x-pusher-socket-id")),
                });
                for (const recipientId of (value.mentionedUserIds ?? []).filter(
                    (candidate: string) => candidate !== request.userId! && !previousMentions.has(candidate),
                )) {
                    await createNotification({
                        recipientId,
                        actorId: request.userId!,
                        communityId: context.community.id,
                        projectId: context.project?.id,
                        conversationId: context.scopeId,
                        resourceType: saved.kind,
                        resourceId: saved.id,
                        type: "mention",
                        title: "You were mentioned",
                        body: `${context.user.profile.username} mentioned you in a ${saved.kind}.`,
                    });
                }
            }
            return saved;
        });
        if (!updated) {
            response
                .status(409)
                .json({ ...CollaborationErrorResponses.MESSAGE_CHANGED_ELSEWHERE_RELOAD_AND_RETRY });
            return;
        }
        request.responseModel = updated;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
