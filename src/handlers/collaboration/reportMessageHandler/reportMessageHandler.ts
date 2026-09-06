import {
    CollaborationMessageQueries,
    MessageReportQueries,
} from "../../../database/queries/collaboration.js";
import type { IRequest } from "../../../helpers/api.js";
import type { ReportMessageRequest } from "./reportMessageRequest.js";

import { runInTransaction } from "../../../database/transaction.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import { resolveScope } from "../../../services/collaboration/collaborationService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CollaborationErrorResponses } from "../../../responses/errors/CollaborationErrorResponses.js";

export async function reportMessageHandler(
    request: IRequest<ReportMessageRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        if (!/^[a-f\d]{24}$/i.test(request.params.id)) {
            response.status(400).json({ code: 400, message: "Invalid message ID." });
            return;
        }
        const message = await CollaborationMessageQueries.getCollaborationMessageByIdQuery(request.params.id);
        const context = message
            ? await resolveScope(request.userId!, {
                  projectId: message.projectId,
                  communityId: message.projectId ? undefined : message.communityId,
              })
            : undefined;
        if (!message || !context || message.authorId === request.userId!) {
            response.status(403).json({ ...CollaborationErrorResponses.MESSAGE_REPORTING_DENIED });
            return;
        }
        const report = await runInTransaction(async () => {
            const saved = await MessageReportQueries.createMessageReportQuery({
                messageId: message.id,
                communityId: message.communityId,
                projectId: message.projectId,
                reporterId: request.userId!,
                reason: value.reason,
                details: value.details,
            });
            const ownerIds = context.community.ownerIds.map(String).filter((id) => id !== request.userId!);
            if (ownerIds.length) {
                await enqueueRealtimeEvent({
                    channels: ownerIds.map(RealtimeChannels.user),
                    eventName: "message-reported-v1",
                    actorId: request.userId!,
                    aggregate: { type: "message-report", id: saved.id, version: 1 },
                    data: { report: saved.toObject({ virtuals: true }) },
                });
            }
            for (const recipientId of ownerIds) {
                await createNotification({
                    recipientId,
                    actorId: request.userId!,
                    communityId: context.community.id,
                    projectId: context.project?.id,
                    resourceType: "message-report",
                    resourceId: saved.id,
                    type: "message-reported",
                    title: "Message reported",
                    body: `A ${message.kind} was reported for ${value.reason}.`,
                });
            }
            return saved;
        });
        request.responseModel = report;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
