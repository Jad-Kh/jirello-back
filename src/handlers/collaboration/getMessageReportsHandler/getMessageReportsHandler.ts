import { MessageReportQueries } from "../../../database/queries/collaboration.js";

import { CommunityQueries } from "../../../database/queries/community.js";
import { UserQueries } from "../../../database/queries/user.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { IMessageReport } from "../../../database/models/collaboration/IMessageReport.js";
import { CollaborationErrorResponses } from "../../../responses/errors/CollaborationErrorResponses.js";

export async function getMessageReportsHandler(
    request: ExpressRequest,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const communityId = String(request.query.communityId ?? "");
        const community = /^[a-f\d]{24}$/i.test(communityId)
            ? await CommunityQueries.getCommunityByIdQuery(communityId)
            : undefined;
        const user = community ? await UserQueries.getUserByIdQuery(request.userId!) : undefined;
        if (
            !community ||
            !user ||
            (!user.isAdmin && !community.ownerIds.map(String).includes(request.userId!))
        ) {
            response.status(403).json({ ...CollaborationErrorResponses.MESSAGE_REPORT_ACCESS_DENIED });
            return;
        }
        const requestedStatus = String(request.query.status ?? "open");
        const status: IMessageReport["status"] = ["open", "reviewed", "dismissed", "actioned"].includes(
            requestedStatus,
        )
            ? (requestedStatus as IMessageReport["status"])
            : "open";
        const reportFilter: QueryFilter<IMessageReport> = { communityId, status };
        const reports = await MessageReportQueries.getMessageReportsQuery(reportFilter)
            .sort({ createdAt: -1 })
            .limit(100);
        request.responseModel = reports;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
