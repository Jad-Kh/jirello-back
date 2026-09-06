import { CollaborationMessageQueries } from "../../../database/queries/collaboration.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { resolveScope, socketId } from "../../../services/collaboration/collaborationService.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { CollaborationErrorResponses } from "../../../responses/errors/CollaborationErrorResponses.js";

export async function deleteMessageHandler(
    request: ExpressRequest<{ id: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        if (!/^[a-f\d]{24}$/i.test(request.params.id)) {
            response.status(400).json({ ...CollaborationErrorResponses.INVALID_MESSAGE_ID });
            return;
        }
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
            response.status(403).json({ ...CollaborationErrorResponses.MESSAGE_DELETION_DENIED });
            return;
        }
        const deletedAt = new Date();
        await runInTransaction(async () => {
            await CollaborationMessageQueries.updateCollaborationMessageFieldsQuery(
                { _id: current.id },
                { $set: { body: "", deletedAt }, $inc: { version: 1 } },
                { session: getTransactionSession() },
            );
            await enqueueRealtimeEvent({
                channels: [context.channel],
                eventName: current.kind === "chat" ? "chat-message-deleted-v1" : "comment-deleted-v1",
                actorId: request.userId!,
                aggregate: { type: current.kind, id: current.id, version: current.version + 1 },
                data: { messageId: current.id, deletedAt: deletedAt.toISOString() },
                socketId: socketId(request.header("x-pusher-socket-id")),
            });
        });
        request.responseModel = { id: current.id, deletedAt };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
