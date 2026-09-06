import { ProjectFinanceQueries } from "../../../database/queries/finance.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateProjectFinanceRequest } from "./updateProjectFinanceRequest.js";

import { getTransactionSession, runInTransaction } from "../../../database/transaction.js";
import { Permissions } from "../../../helpers/permissions.js";
import { RealtimeChannels } from "../../../realtime/channels.js";
import { enqueueRealtimeEvent, pusherSocketId, realtimeVersion } from "../../../realtime/events.js";
import { isCommunityManager, projectAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { FinanceErrorResponses } from "../../../responses/errors/FinanceErrorResponses.js";

export async function updateProjectFinanceHandler(
    request: IRequest<UpdateProjectFinanceRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await projectAccess(request.userId!, request.params.projectId, "projects", [
            Permissions.EDIT_OTHER,
        ]);
        if (!context || !isCommunityManager(context, request.userId!)) {
            response.status(403).json({ ...FinanceErrorResponses.PROJECT_FINANCIAL_UPDATE_ACCESS_DENIED });
            return;
        }
        const members = new Set([...context.community.ownerIds, ...context.community.userIds].map(String));
        if (value.memberRates.some((rate: { userId: string }) => !members.has(rate.userId))) {
            response
                .status(400)
                .json({ ...FinanceErrorResponses.FINANCIAL_RATES_CAN_ONLY_REFERENCE_COMMUNITY_MEMBERS });
            return;
        }
        const finance = await runInTransaction(async () => {
            const updated = await ProjectFinanceQueries.updateProjectFinanceQuery(
                { projectId: request.params.projectId },
                {
                    $set: {
                        ...value,
                        projectId: request.params.projectId,
                        communityId: context.community.id,
                    },
                },
                { new: true, upsert: true, setDefaultsOnInsert: true, session: getTransactionSession() },
            );
            if (!updated) throw new Error("Project finance upsert did not return a document.");
            await enqueueRealtimeEvent({
                channels: [RealtimeChannels.community(context.community.id)],
                eventName: "project-finance-updated-v1",
                actorId: request.userId!,
                aggregate: { type: "project-finance", id: updated.id, version: realtimeVersion(updated) },
                data: { projectId: request.params.projectId },
                socketId: pusherSocketId(request.header("x-pusher-socket-id")),
            });
            return updated;
        });
        request.responseModel = finance;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
