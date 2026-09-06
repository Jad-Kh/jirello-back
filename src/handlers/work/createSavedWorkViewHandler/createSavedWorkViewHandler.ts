import { SavedWorkViewQueries } from "../../../database/queries/work.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateSavedWorkViewRequest } from "./createSavedWorkViewRequest.js";

import { isCommunityManager } from "../../../security/domainAccess.js";
import { scopedAccess } from "../../../services/work/workService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function createSavedWorkViewHandler(
    request: IRequest<CreateSavedWorkViewRequest, "">,
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
        if (value.visibility !== "private" && !isCommunityManager(context, request.userId!)) {
            response
                .status(403)
                .json({ ...WorkErrorResponses.ONLY_COMMUNITY_MANAGERS_CAN_PUBLISH_SHARED_VIEWS });
            return;
        }
        const view = await SavedWorkViewQueries.createSavedWorkViewQuery({
            ...value,
            ownerId: request.userId!,
        });
        request.responseModel = view;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
