import { WorkTemplateQueries } from "../../../database/queries/work.js";

import { isCommunityManager } from "../../../security/domainAccess.js";
import { scopedAccess } from "../../../services/work/workService.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function deleteWorkTemplateHandler(
    request: ExpressRequest<{ id: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const template = await WorkTemplateQueries.getWorkTemplateByIdQuery(request.params.id);
        const context = template
            ? await scopedAccess(request.userId!, template.communityId, template.projectId)
            : undefined;
        if (
            !template ||
            !context ||
            (template.createdBy !== request.userId! && !isCommunityManager(context, request.userId!))
        ) {
            response.status(403).json({ ...WorkErrorResponses.TEMPLATE_ACCESS_DENIED });
            return;
        }
        await template.deleteOne();
        request.responseModel = { id: template.id };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
