import { WorkTemplateQueries } from "../../../database/queries/work.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetWorkTemplatesRequest } from "./getWorkTemplatesRequest.js";

import { scopedAccess } from "../../../services/work/workService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function getWorkTemplatesHandler(
    request: IRequest<GetWorkTemplatesRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        if (!(await scopedAccess(request.userId!, value.communityId, value.projectId))) {
            response.status(403).json({ ...WorkErrorResponses.TEMPLATE_ACCESS_DENIED });
            return;
        }
        const templates = await WorkTemplateQueries.getWorkTemplatesQuery({
            communityId: value.communityId,
            $or: [{ projectId: value.projectId }, { projectId: { $exists: false } }],
        }).sort({ name: 1 });
        request.responseModel = templates;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
