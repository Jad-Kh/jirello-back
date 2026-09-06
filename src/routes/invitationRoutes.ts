import { Router } from "express";
import { endpointForward } from "../helpers/endpointForward.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getInvitationsHandler } from "../handlers/invitation/getInvitationsHandler/getInvitationsHandler.js";
import { createInvitationHandler } from "../handlers/invitation/createInvitationHandler/createInvitationHandler.js";
import { respondToInvitationHandler } from "../handlers/invitation/respondToInvitationHandler/respondToInvitationHandler.js";
import {
    respondToInvitationValidator,
    createInvitationValidator,
} from "../validators/invitationValidators.js";
import {
    createInvitationPresenter,
    getInvitationsPresenter,
    respondToInvitationPresenter,
} from "../presenters/invitationPresenter.js";

const invitationRoutes = Router();

invitationRoutes.use(tokenSecurity);

invitationRoutes.get("/", getInvitationsHandler, getInvitationsPresenter, endpointForward);

invitationRoutes.post(
    "/",
    createInvitationValidator,
    createInvitationHandler,
    createInvitationPresenter,
    endpointForward,
);

invitationRoutes.post(
    "/:id/respond",
    respondToInvitationValidator,

    respondToInvitationHandler,
    respondToInvitationPresenter,
    endpointForward,
);

export { invitationRoutes };
