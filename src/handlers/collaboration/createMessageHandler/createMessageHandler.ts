import { CollaborationMessageQueries } from "../../../database/queries/collaboration.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateMessageRequest } from "./createMessageRequest.js";

import { runInTransaction } from "../../../database/transaction.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import { resolveScope, socketId } from "../../../services/collaboration/collaborationService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CollaborationErrorResponses } from "../../../responses/errors/CollaborationErrorResponses.js";

export async function createMessageHandler(
    request: IRequest<CreateMessageRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await resolveScope(request.userId!, value);
        if (!context || (value.kind === "comment" && !context.project)) {
            response.status(403).json({ ...CollaborationErrorResponses.CONVERSATION_ACCESS_DENIED });
            return;
        }
        const memberIds = new Set([...context.community.ownerIds, ...context.community.userIds].map(String));
        if (value.mentionedUserIds.some((id: string) => !memberIds.has(id))) {
            response
                .status(400)
                .json({ ...CollaborationErrorResponses.MENTIONED_USERS_MUST_BELONG_TO_THE_COMMUNITY });
            return;
        }
        if (value.parentId) {
            const parent = await CollaborationMessageQueries.getCollaborationMessageByIdQuery(value.parentId);
            if (!parent || parent.scopeType !== context.scopeType || parent.scopeId !== context.scopeId) {
                response
                    .status(400)
                    .json({ ...CollaborationErrorResponses.PARENT_MESSAGE_MUST_BELONG_TO_THIS_CONVERSATION });
                return;
            }
        }
        const message = await runInTransaction(async () => {
            const saved = await CollaborationMessageQueries.createCollaborationMessageQuery({
                kind: value.kind,
                scopeType: context.scopeType,
                scopeId: context.scopeId,
                communityId: context.community.id,
                projectId: context.project?.id,
                authorId: request.userId!,
                body: value.body,
                parentId: value.parentId,
                mentionedUserIds: value.mentionedUserIds,
            });
            await enqueueRealtimeEvent({
                channels: [context.channel],
                eventName: value.kind === "chat" ? "chat-message-created-v1" : "comment-created-v1",
                actorId: request.userId!,
                aggregate: { type: value.kind, id: saved.id, version: saved.version },
                data: { message: saved.toObject({ virtuals: true }) },
                socketId: socketId(request.header("x-pusher-socket-id")),
            });
            for (const recipientId of value.mentionedUserIds.filter((id: string) => id !== request.userId!)) {
                await createNotification({
                    recipientId,
                    actorId: request.userId!,
                    communityId: context.community.id,
                    projectId: context.project?.id,
                    conversationId: context.scopeId,
                    resourceType: value.kind,
                    resourceId: saved.id,
                    type: "mention",
                    title: "You were mentioned",
                    body: `${context.user.profile.username} mentioned you in a ${value.kind}.`,
                });
            }
            return saved;
        });
        request.responseModel = message;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
