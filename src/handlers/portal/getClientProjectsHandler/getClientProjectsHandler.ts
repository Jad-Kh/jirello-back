import { ClientPortalQueries, GuestAccessQueries } from "../../../database/queries/portal.js";

import type { NextFunction, Request as ExpressRequest, Response as ExpressResponseHandler } from "express";

export async function getClientProjectsHandler(
    request: ExpressRequest,
    _response: ExpressResponseHandler,
    next: NextFunction,
) {
    try {
        const access = await GuestAccessQueries.getGuestAccessesQuery({
            userId: request.userId!,
            status: "active",
            $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
        }).sort({ updatedAt: -1 });
        const portals = await ClientPortalQueries.getClientPortalsQuery({
            projectId: { $in: access.map((item) => item.projectId) },
            enabled: true,
        });
        request.responseModel = portals.map((portal) => ({
            portal,
            access: access.find((item) => item.projectId === portal.projectId),
        }));
        next();
        return;
    } catch (error) {
        next(error);
    }
}
