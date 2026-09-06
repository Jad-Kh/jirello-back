import { SavedWorkViewQueries } from "../../../database/queries/work.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetSavedWorkViewsRequest } from "./getSavedWorkViewsRequest.js";

import { scopedAccess } from "../../../services/work/workService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function getSavedWorkViewsHandler(
    request: IRequest<GetSavedWorkViewsRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await scopedAccess(request.userId!, value.communityId, value.projectId);
        if (!context) {
            response.status(403).json({ ...WorkErrorResponses.SAVED_VIEW_ACCESS_DENIED });
            return;
        }
        const views = await SavedWorkViewQueries.getSavedWorkViewsQuery({
            communityId: value.communityId,
            ...(value.projectId
                ? { $or: [{ projectId: value.projectId }, { projectId: { $exists: false } }] }
                : {}),
            $and: [{ $or: [{ ownerId: request.userId! }, { visibility: { $ne: "private" } }] }],
        }).sort({ name: 1 });
        request.responseModel = views;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
