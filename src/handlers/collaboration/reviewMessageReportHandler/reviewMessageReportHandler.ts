import {
    CollaborationMessageQueries,
    MessageReportQueries,
} from "../../../database/queries/collaboration.js";
import type { IRequest } from "../../../helpers/api.js";
import type { ReviewMessageReportRequest } from "./reviewMessageReportRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { enqueueRealtimeEvent } from "../../../realtime/events.js";
import { createNotification } from "../../../services/notification/notificationService.js";
import { resolveScope } from "../../../services/collaboration/collaborationService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { CollaborationErrorResponses } from "../../../responses/errors/CollaborationErrorResponses.js";

export async function reviewMessageReportHandler(
    request: IRequest<ReviewMessageReportRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        if (!/^[a-f\d]{24}$/i.test(request.params.id)) {
            response.status(400).json({ code: 400, message: "Invalid report ID." });
            return;
        }
        const report = await MessageReportQueries.getMessageReportByIdQuery(request.params.id);
        const message = report
            ? await CollaborationMessageQueries.getCollaborationMessageByIdQuery(report.messageId)
            : undefined;
        const context = message
            ? await resolveScope(request.userId!, {
                  projectId: message.projectId,
                  communityId: message.projectId ? undefined : message.communityId,
              })
            : undefined;
        if (
            !report ||
            !message ||
            !context ||
            (!context.user.isAdmin && !context.community.ownerIds.map(String).includes(request.userId!))
        ) {
            response.status(403).json({ ...CollaborationErrorResponses.MESSAGE_REPORT_REVIEW_DENIED });
            return;
        }
        const reviewedAt = new Date();
        const updated = await runInTransaction(async () => {
            const saved = await MessageReportQueries.updateMessageReportByIdQuery(
                report.id,
                { $set: { status: value.status, reviewedBy: request.userId!, reviewedAt } },
                { new: true, session: getTransactionSession() },
            );
            if (value.status === "actioned" && !message.deletedAt) {
                await CollaborationMessageQueries.updateCollaborationMessageFieldsQuery(
                    { _id: message.id },
                    { $set: { body: "", deletedAt: reviewedAt }, $inc: { version: 1 } },
                    { session: getTransactionSession() },
                );
                await enqueueRealtimeEvent({
                    channels: [context.channel],
                    eventName: message.kind === "chat" ? "chat-message-deleted-v1" : "comment-deleted-v1",
                    actorId: request.userId!,
                    aggregate: { type: message.kind, id: message.id, version: message.version + 1 },
                    data: { messageId: message.id, deletedAt: reviewedAt.toISOString(), moderated: true },
                });
            }
            await createNotification({
                recipientId: report.reporterId,
                actorId: request.userId!,
                communityId: report.communityId,
                projectId: report.projectId,
                resourceType: "message-report",
                resourceId: report.id,
                type: "message-report-reviewed",
                title: "Message report reviewed",
                body: `Your message report was ${value.status}.`,
            });
            return saved;
        });
        request.responseModel = updated;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
