import { ProjectFinanceQueries } from "../../../database/queries/finance.js";
import type { IRequest } from "../../../helpers/api.js";
import type { GetProjectFinanceSummaryRequest } from "./getProjectFinanceSummaryRequest.js";
import { TimeEntryQueries } from "../../../database/queries/time.js";

import { Permissions } from "../../../helpers/permissions.js";
import { isCommunityManager, projectAccess } from "../../../security/domainAccess.js";
import type { NextFunction, Response as ExpressResponseHandler } from "express";
import { FinanceErrorResponses } from "../../../responses/errors/FinanceErrorResponses.js";

export async function getProjectFinanceSummaryHandler(
    request: IRequest<GetProjectFinanceSummaryRequest, "">,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const value = request.requestModel!;
        const context = await projectAccess(request.userId!, request.params.projectId, "projects", [
            Permissions.READ_OTHER,
        ]);
        if (!context || !isCommunityManager(context, request.userId!)) {
            response.status(403).json({ ...FinanceErrorResponses.PROJECT_FINANCIAL_ACCESS_DENIED });
            return;
        }
        const [finance, entries] = await Promise.all([
            ProjectFinanceQueries.getProjectFinanceQuery({ projectId: request.params.projectId }),
            TimeEntryQueries.getTimeEntriesQuery({
                projectId: request.params.projectId,
                endedAt: { $exists: true },
                ...(value.from || value.to
                    ? {
                          startedAt: {
                              ...(value.from ? { $gte: value.from } : {}),
                              ...(value.to ? { $lt: value.to } : {}),
                          },
                      }
                    : {}),
            }),
        ]);
        const totals = entries.reduce(
            (result, entry) => {
                const minutes = entry.durationMinutes ?? 0;
                result.minutes += minutes;
                result.costCents += Math.round((minutes / 60) * (entry.costRateCents ?? 0));
                if (entry.billable)
                    result.billableCents += Math.round((minutes / 60) * (entry.billingRateCents ?? 0));
                return result;
            },
            { minutes: 0, costCents: 0, billableCents: 0 },
        );
        request.responseModel = {
            currency: finance?.currency ?? "USD",
            budgetCents: finance?.budgetCents,
            ...totals,
            remainingBudgetCents:
                finance?.budgetCents === undefined ? undefined : finance.budgetCents - totals.costCents,
            marginCents: totals.billableCents - totals.costCents,
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
