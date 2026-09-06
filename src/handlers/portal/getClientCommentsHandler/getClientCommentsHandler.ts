import { PortalCommentQueries } from "../../../database/queries/portal.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetClientCommentsRequest } from "./getClientCommentsRequest.js";

import { Permissions } from "../../../helpers/permissions.js";
import { projectAccess } from "../../../security/domainAccess.js";
import { activeGuest } from "../../../services/portal/portalService.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function getClientCommentsHandler(
    request: IRequest<GetClientCommentsRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const guest = await activeGuest(request.userId!, request.params.projectId);
        const member = await projectAccess(request.userId!, request.params.projectId, "tasks", [
            Permissions.READ_OWN,
            Permissions.READ_OTHER,
        ]);
        if (!guest && !member) {
            response.status(403).json({ ...PortalErrorResponses.CLIENT_COMMENT_ACCESS_DENIED });
            return;
        }
        const value = request.requestModel!;
        const comments = await PortalCommentQueries.getPortalCommentsQuery({
            projectId: request.params.projectId,
            ...value,
        })
            .sort({ createdAt: 1 })
            .limit(500);
        request.responseModel = comments;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
