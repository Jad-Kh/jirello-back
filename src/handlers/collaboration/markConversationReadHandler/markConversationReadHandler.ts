import { ConversationReadQueries } from "../../../database/queries/collaboration.js";
import type { IRequest } from "../../../helpers/api.js";
import type { MarkConversationReadRequest } from "./markConversationReadRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { resolveScope } from "../../../services/collaboration/collaborationService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { IConversationRead } from "../../../database/models/collaboration/IConversationRead.js";
import { CollaborationErrorResponses } from "../../../responses/errors/CollaborationErrorResponses.js";

export async function markConversationReadHandler(
    request: IRequest<MarkConversationReadRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await resolveScope(request.userId!, value);
        if (!context) {
            response.status(403).json({ ...CollaborationErrorResponses.CONVERSATION_ACCESS_DENIED });
            return;
        }
        const lastReadAt = new Date();
        await runInTransaction(async () => {
            const readFilter: QueryFilter<IConversationRead> = {
                userId: request.userId!,
                scopeType: context.scopeType,
                scopeId: context.scopeId,
            };
            await ConversationReadQueries.updateConversationReadQuery(
                readFilter,
                { $set: { lastReadAt } },
                { upsert: true, new: true, session: getTransactionSession() },
            );
            await enqueueRealtimeEvent({
                channels: [RealtimeChannels.user(request.userId!)],
                eventName: "conversation-read-v1",
                actorId: request.userId!,
                aggregate: { type: "conversation-read", id: context.scopeId, version: lastReadAt.getTime() },
                data: {
                    scopeType: context.scopeType,
                    scopeId: context.scopeId,
                    lastReadAt: lastReadAt.toISOString(),
                },
            });
        });
        request.responseModel = { lastReadAt };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
