import { ClientPortalQueries, DeliverableQueries } from "../../../database/queries/portal.js";
import { TaskQueries } from "../../../database/queries/task.js";

import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";
import { PortalErrorResponses } from "../../../responses/errors/PortalErrorResponses.js";

export async function getPublicProjectHandler(
    request: ExpressRequest<{ slug: string }>,
    response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        if (!/^[a-z0-9][a-z0-9-]{2,79}$/.test(request.params.slug)) {
            response.status(404).json({ ...PortalErrorResponses.PUBLIC_STATUS_PAGE_NOT_FOUND });
            return;
        }
        const portal = await ClientPortalQueries.getClientPortalQuery({
            publicSlug: request.params.slug,
            publicEnabled: true,
            enabled: true,
        });
        if (!portal) {
            response.status(404).json({ ...PortalErrorResponses.PUBLIC_STATUS_PAGE_NOT_FOUND });
            return;
        }
        const [tasks, deliverables] = await Promise.all([
            TaskQueries.getTasksQuery({ projectId: portal.projectId, audience: "client" }).select(
                "title status milestone deadlineAt accomplished",
            ),
            DeliverableQueries.getDeliverablesQuery({
                projectId: portal.projectId,
                status: { $in: ["submitted", "approved"] },
            }).select("title dueAt status submittedAt"),
        ]);
        request.responseModel = {
            name: portal.name,
            welcomeMessage: portal.welcomeMessage,
            logoUrl: portal.logoUrl,
            accentColor: portal.accentColor,
            progress: portal.showProgress
                ? { total: tasks.length, completed: tasks.filter((task) => task.accomplished).length }
                : undefined,
            milestones: portal.showMilestones ? tasks.filter((task) => task.milestone) : undefined,
            deliverables,
            updatedAt: portal.updatedAt,
        };
        next();
        return;
    } catch (error) {
        next(error);
    }
}
