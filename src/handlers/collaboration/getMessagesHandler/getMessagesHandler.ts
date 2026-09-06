import {
    CollaborationMessageQueries,
    ConversationReadQueries,
} from "../../../database/queries/collaboration.js";
import { decodeDateCursor, encodeDateCursor } from "../../../helpers/cursorPagination.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetMessagesRequest } from "./getMessagesRequest.js";

import { resolveScope } from "../../../services/collaboration/collaborationService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { ICollaborationMessage } from "../../../database/models/collaboration/ICollaborationMessage.js";
import type { IConversationRead } from "../../../database/models/collaboration/IConversationRead.js";
import { CollaborationErrorResponses } from "../../../responses/errors/CollaborationErrorResponses.js";
import mongoose from "mongoose";

export async function getMessagesHandler(
    request: IRequest<GetMessagesRequest, "">,
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
        const cursor = value.cursor ? decodeDateCursor(value.cursor) : null;
        if (value.cursor && !cursor) {
            response.status(400).json({ ...CollaborationErrorResponses.VALIDATION_ERROR });
            return;
        }
        const before = value.before ? new Date(value.before) : undefined;
        const cursorDate = cursor ? new Date(cursor.createdAt) : undefined;
        const chronologicalFilter: QueryFilter<ICollaborationMessage> =
            cursorDate && cursor
                ? {
                      $or: [
                          { createdAt: { $lt: cursorDate } },
                          {
                              createdAt: cursorDate,
                              _id: { $lt: new mongoose.Types.ObjectId(cursor.id) },
                          },
                      ],
                  }
                : before
                  ? { createdAt: { $lt: before } }
                  : {};
        const messageFilter: QueryFilter<ICollaborationMessage> = {
            scopeType: context.scopeType,
            scopeId: context.scopeId,
            ...(value.kind ? { kind: value.kind } : {}),
            ...chronologicalFilter,
        };
        const candidates = await CollaborationMessageQueries.getCollaborationMessagesQuery(messageFilter)
            .sort({ createdAt: -1, _id: -1 })
            .limit(value.limit + 1);
        const hasMore = candidates.length > value.limit;
        const messages = candidates.slice(0, value.limit);
        const last = messages.at(-1);
        const readFilter: QueryFilter<IConversationRead> = {
            userId: request.userId!,
            scopeType: context.scopeType,
            scopeId: context.scopeId,
        };
        const read = await ConversationReadQueries.getConversationReadQuery(readFilter);
        const unreadFilter: QueryFilter<ICollaborationMessage> = {
            scopeType: context.scopeType,
            scopeId: context.scopeId,
            authorId: { $ne: request.userId! },
            createdAt: { $gt: read?.lastReadAt ?? new Date(0) },
            deletedAt: { $exists: false },
        };
        const unreadCount = await CollaborationMessageQueries.countCollaborationMessagesQuery(unreadFilter);
        request.responseModel = {
            messages,
            unreadCount,
            nextCursor: hasMore && last && last.createdAt ? encodeDateCursor(last.createdAt, last.id) : null,
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
