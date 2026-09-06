import { ProjectFinanceQueries } from "../../../database/queries/finance.js";

import { Permissions } from "../../../helpers/permissions.js";
import { isCommunityManager, projectAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { FinanceErrorResponses } from "../../../responses/errors/FinanceErrorResponses.js";

export async function getProjectFinanceHandler(
    request: ExpressRequest<{ projectId: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const context = await projectAccess(request.userId!, request.params.projectId, "projects", [
            Permissions.READ_OTHER,
        ]);
        if (!context || !isCommunityManager(context, request.userId!)) {
            response.status(403).json({ ...FinanceErrorResponses.PROJECT_FINANCIAL_ACCESS_DENIED });
            return;
        }
        const finance = await ProjectFinanceQueries.getProjectFinanceQuery({
            projectId: request.params.projectId,
        });
        request.responseModel = finance;
        next();
        return;
    } catch (error) {
        next(error);
    }
}
