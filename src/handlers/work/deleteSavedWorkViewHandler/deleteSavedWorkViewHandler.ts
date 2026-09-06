import { SavedWorkViewQueries } from "../../../database/queries/work.js";

import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function deleteSavedWorkViewHandler(
    request: ExpressRequest<{ id: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const view = await SavedWorkViewQueries.deleteSavedWorkViewQuery({
            _id: request.params.id,
            ownerId: request.userId!,
        });
        if (!view) {
            response.status(403).json({ ...WorkErrorResponses.ONLY_THE_VIEW_OWNER_CAN_DELETE_IT });
            return;
        }
        request.responseModel = { id: view.id };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
