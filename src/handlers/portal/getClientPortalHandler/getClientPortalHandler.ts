import { ClientPortalQueries, DeliverableQueries } from "../../../database/queries/portal.js";
import { ProjectFinanceQueries } from "../../../database/queries/finance.js";
import { TaskQueries } from "../../../database/queries/task.js";
import { TimeEntryQueries } from "../../../database/queries/time.js";

import { Permissions } from "../../../helpers/permissions.js";
import { projectAccess } from "../../../security/domainAccess.js";
import { activeGuest, presentClientTask } from "../../../services/portal/portalService.js";
import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function getClientPortalHandler(
    request: ExpressRequest<{ projectId: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const [guest, member, portal] = await Promise.all([
            activeGuest(request.userId!, request.params.projectId),
            projectAccess(request.userId!, request.params.projectId, "projects", [
                Permissions.READ_OWN,
                Permissions.READ_OTHER,
            ]),
            ClientPortalQueries.getClientPortalQuery({ projectId: request.params.projectId, enabled: true }),
        ]);
        if ((!guest && !member) || !portal) {
            response.status(403).json({ ...PortalErrorResponses.CLIENT_PORTAL_ACCESS_DENIED });
            return;
        }
        const [tasks, deliverables, finance, timeEntries] = await Promise.all([
            TaskQueries.getTasksQuery({ projectId: request.params.projectId, audience: "client" }).sort({
                status: 1,
                position: 1,
            }),
            DeliverableQueries.getDeliverablesQuery({
                projectId: request.params.projectId,
                status: { $ne: "draft" },
            }).sort({
                createdAt: -1,
            }),
            portal.showFinancials
                ? ProjectFinanceQueries.getProjectFinanceQuery({
                      projectId: request.params.projectId,
                      visibleToClients: true,
                  })
                : undefined,
            portal.showFinancials
                ? TimeEntryQueries.getTimeEntriesQuery({
                      projectId: request.params.projectId,
                      billable: true,
                      status: "approved",
                  })
                : [],
        ]);
        const financials = finance
            ? {
                  currency: finance.currency,
                  billingModel: finance.billingModel,
                  budgetCents: finance.budgetCents,
                  billableCents: timeEntries.reduce(
                      (sum, entry) =>
                          sum +
                          Math.round(((entry.durationMinutes ?? 0) / 60) * (entry.billingRateCents ?? 0)),
                      0,
                  ),
              }
            : undefined;
        request.responseModel = {
            portal,
            access: guest ? { role: guest.role, expiresAt: guest.expiresAt } : { role: "member" },
            tasks: tasks.map(presentClientTask),
            deliverables,
            financials,
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
