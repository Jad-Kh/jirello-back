import { WorkTemplateQueries } from "../../../database/queries/work.js";
import type { IRequest } from "../../../helpers/api.js";
import type { CreateWorkTemplateRequest } from "./createWorkTemplateRequest.js";

import { scopedAccess } from "../../../services/work/workService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { WorkErrorResponses } from "../../../responses/errors/WorkErrorResponses.js";

export async function createWorkTemplateHandler(
    request: IRequest<CreateWorkTemplateRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        if (!(await scopedAccess(request.userId!, value.communityId, value.projectId))) {
            response.status(403).json({ ...WorkErrorResponses.TEMPLATE_ACCESS_DENIED });
            return;
        }
        const template = await WorkTemplateQueries.createWorkTemplateQuery({
            ...value,
            createdBy: request.userId!,
        });
        request.responseModel = template;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
