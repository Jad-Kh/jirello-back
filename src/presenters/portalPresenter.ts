import { createPresenter } from "../helpers/presenting.js";
import { ClientPortalResponse } from "../models/portal/ClientPortalResponse.js";
import { DeliverableResponse } from "../models/portal/DeliverableResponse.js";
import { GuestAccessResponse } from "../models/portal/GuestAccessResponse.js";
import { PortalCommentResponse } from "../models/portal/PortalCommentResponse.js";
import { PortalCommentsResponse } from "../models/portal/PortalCommentsResponse.js";
import { PortalSuccessResponses } from "../responses/success/PortalSuccessResponses.js";

export const getPublicProjectPresenter = createPresenter(PortalSuccessResponses.PUBLIC_PROJECT_STATUS_LOADED);
export const getClientProjectsPresenter = createPresenter(PortalSuccessResponses.CLIENT_PROJECTS_LOADED);
export const getClientPortalPresenter = createPresenter(PortalSuccessResponses.CLIENT_PORTAL_LOADED);
export const configureClientPortalPresenter = createPresenter(
    PortalSuccessResponses.CLIENT_PORTAL_CONFIGURED,
    ClientPortalResponse,
);
export const grantGuestAccessPresenter = createPresenter(
    PortalSuccessResponses.GUEST_ACCESS_GRANTED,
    GuestAccessResponse,
);
export const revokeGuestAccessPresenter = createPresenter(PortalSuccessResponses.GUEST_ACCESS_REVOKED);
export const createDeliverablePresenter = createPresenter(
    PortalSuccessResponses.DELIVERABLE_CREATED,
    DeliverableResponse,
);
export const decideDeliverablePresenter = createPresenter(
    PortalSuccessResponses.DEFAULT,
    DeliverableResponse,
);
export const updateDeliverablePresenter = createPresenter(
    PortalSuccessResponses.DEFAULT,
    DeliverableResponse,
);
export const getClientCommentsPresenter = createPresenter(
    PortalSuccessResponses.CLIENT_COMMENTS_LOADED,
    PortalCommentsResponse,
);
export const createClientCommentPresenter = createPresenter(
    PortalSuccessResponses.CLIENT_COMMENT_CREATED,
    PortalCommentResponse,
);
