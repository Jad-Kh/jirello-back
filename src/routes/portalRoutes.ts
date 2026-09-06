import { Router } from "express";
import { endpointForward } from "../helpers/endpointForward.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getPublicProjectHandler } from "../handlers/portal/getPublicProjectHandler/getPublicProjectHandler.js";
import { getClientProjectsHandler } from "../handlers/portal/getClientProjectsHandler/getClientProjectsHandler.js";
import { getClientPortalHandler } from "../handlers/portal/getClientPortalHandler/getClientPortalHandler.js";
import { configureClientPortalHandler } from "../handlers/portal/configureClientPortalHandler/configureClientPortalHandler.js";
import { grantGuestAccessHandler } from "../handlers/portal/grantGuestAccessHandler/grantGuestAccessHandler.js";
import { revokeGuestAccessHandler } from "../handlers/portal/revokeGuestAccessHandler/revokeGuestAccessHandler.js";
import { createDeliverableHandler } from "../handlers/portal/createDeliverableHandler/createDeliverableHandler.js";
import { decideDeliverableHandler } from "../handlers/portal/decideDeliverableHandler/decideDeliverableHandler.js";
import { updateDeliverableHandler } from "../handlers/portal/updateDeliverableHandler/updateDeliverableHandler.js";
import { getClientCommentsHandler } from "../handlers/portal/getClientCommentsHandler/getClientCommentsHandler.js";
import { createClientCommentHandler } from "../handlers/portal/createClientCommentHandler/createClientCommentHandler.js";
import {
    getClientCommentsValidator,
    updateDeliverableValidator,
    decideDeliverableValidator,
    createClientCommentValidator,
    createDeliverableValidator,
    grantGuestAccessValidator,
    configureClientPortalValidator,
} from "../validators/portalValidators.js";
import {
    configureClientPortalPresenter,
    createClientCommentPresenter,
    createDeliverablePresenter,
    decideDeliverablePresenter,
    getClientCommentsPresenter,
    getClientPortalPresenter,
    getClientProjectsPresenter,
    getPublicProjectPresenter,
    grantGuestAccessPresenter,
    revokeGuestAccessPresenter,
    updateDeliverablePresenter,
} from "../presenters/portalPresenter.js";

const portalRoutes = Router();

portalRoutes.get("/public/:slug", getPublicProjectHandler, getPublicProjectPresenter, endpointForward);

portalRoutes.use(tokenSecurity);

portalRoutes.get("/projects", getClientProjectsHandler, getClientProjectsPresenter, endpointForward);

portalRoutes.get("/projects/:projectId", getClientPortalHandler, getClientPortalPresenter, endpointForward);

portalRoutes.put(
    "/projects/:projectId/settings",
    configureClientPortalValidator,

    configureClientPortalHandler,
    configureClientPortalPresenter,
    endpointForward,
);

portalRoutes.post(
    "/projects/:projectId/guests",
    grantGuestAccessValidator,

    grantGuestAccessHandler,
    grantGuestAccessPresenter,
    endpointForward,
);

portalRoutes.delete("/guests/:id", revokeGuestAccessHandler, revokeGuestAccessPresenter, endpointForward);

portalRoutes.post(
    "/projects/:projectId/deliverables",
    createDeliverableValidator,

    createDeliverableHandler,
    createDeliverablePresenter,
    endpointForward,
);

portalRoutes.post(
    "/deliverables/:id/decision",
    decideDeliverableValidator,

    decideDeliverableHandler,
    decideDeliverablePresenter,
    endpointForward,
);

portalRoutes.patch(
    "/deliverables/:id",
    updateDeliverableValidator,

    updateDeliverableHandler,
    updateDeliverablePresenter,
    endpointForward,
);

portalRoutes.get(
    "/projects/:projectId/comments",
    getClientCommentsValidator,

    getClientCommentsHandler,
    getClientCommentsPresenter,
    endpointForward,
);

portalRoutes.post(
    "/projects/:projectId/comments",
    createClientCommentValidator,

    createClientCommentHandler,
    createClientCommentPresenter,
    endpointForward,
);

export { portalRoutes };
