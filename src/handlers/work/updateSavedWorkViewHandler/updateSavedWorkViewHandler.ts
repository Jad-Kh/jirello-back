import { SavedWorkViewQueries } from "../../../database/queries/work.js";
import type { IRequest } from "../../../helpers/api.js";
import type { UpdateSavedWorkViewRequest } from "./updateSavedWorkViewRequest.js";

import { isCommunityManager } from "../../../security/domainAccess.js";
import { scopedAccess } from "../../../services/work/workService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function updateSavedWorkViewHandler(
    request: IRequest<UpdateSavedWorkViewRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const existing = await SavedWorkViewQueries.getSavedWorkViewQuery({
            _id: request.params.id,
            ownerId: request.userId!,
        });
        const value = request.requestModel!;
        if (!existing) {
            response.status(403).json({ ...WorkErrorResponses.ONLY_THE_VIEW_OWNER_CAN_UPDATE_IT });
            return;
        }
        const context = await scopedAccess(request.userId!, existing.communityId, existing.projectId);
        if (
            !context ||
            (value.visibility &&
                value.visibility !== "private" &&
                !isCommunityManager(context, request.userId!))
        ) {
            response
                .status(403)
                .json({ ...WorkErrorResponses.ONLY_COMMUNITY_MANAGERS_CAN_PUBLISH_SHARED_VIEWS });
            return;
        }
        const { communityId: _communityId, projectId: _projectId, ...updates } = value;
        const view = await SavedWorkViewQueries.updateSavedWorkViewByIdQuery(
            existing.id,
            { $set: updates },
            { new: true },
        );
        request.responseModel = view;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
