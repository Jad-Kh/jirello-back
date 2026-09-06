import { Router } from "express";
import { endpointForward } from "../helpers/endpointForward.js";
import { tokenSecurity } from "../security/tokenSecurity.js";
import { getMessagesHandler } from "../handlers/collaboration/getMessagesHandler/getMessagesHandler.js";
import { createMessageHandler } from "../handlers/collaboration/createMessageHandler/createMessageHandler.js";
import { reportMessageHandler } from "../handlers/collaboration/reportMessageHandler/reportMessageHandler.js";
import { getMessageReportsHandler } from "../handlers/collaboration/getMessageReportsHandler/getMessageReportsHandler.js";
import { reviewMessageReportHandler } from "../handlers/collaboration/reviewMessageReportHandler/reviewMessageReportHandler.js";
import { updateMessageHandler } from "../handlers/collaboration/updateMessageHandler/updateMessageHandler.js";
import { deleteMessageHandler } from "../handlers/collaboration/deleteMessageHandler/deleteMessageHandler.js";
import { markConversationReadHandler } from "../handlers/collaboration/markConversationReadHandler/markConversationReadHandler.js";
import { messageWriteRateLimit } from "../services/collaboration/collaborationService.js";
import {
    getMessagesValidator,
    updateMessageValidator,
    reviewMessageReportValidator,
    reportMessageValidator,
    createMessageValidator,
    markConversationReadValidator,
} from "../validators/collaborationValidators.js";
import {
    createMessagePresenter,
    deleteMessagePresenter,
    getMessageReportsPresenter,
    getMessagesPresenter,
    markConversationReadPresenter,
    reportMessagePresenter,
    reviewMessageReportPresenter,
    updateMessagePresenter,
} from "../presenters/collaborationPresenter.js";

const collaborationRoutes = Router();

collaborationRoutes.use(tokenSecurity);

collaborationRoutes.get(
    "/messages",
    getMessagesValidator,
    getMessagesHandler,
    getMessagesPresenter,
    endpointForward,
);

collaborationRoutes.post(
    "/messages",
    messageWriteRateLimit,
    createMessageValidator,

    createMessageHandler,
    createMessagePresenter,
    endpointForward,
);

collaborationRoutes.post(
    "/messages/:id/report",
    reportMessageValidator,

    reportMessageHandler,
    reportMessagePresenter,
    endpointForward,
);

collaborationRoutes.get("/reports", getMessageReportsHandler, getMessageReportsPresenter, endpointForward);

collaborationRoutes.patch(
    "/reports/:id",
    reviewMessageReportValidator,

    reviewMessageReportHandler,
    reviewMessageReportPresenter,
    endpointForward,
);

collaborationRoutes.patch(
    "/messages/:id",
    updateMessageValidator,

    updateMessageHandler,
    updateMessagePresenter,
    endpointForward,
);

collaborationRoutes.delete("/messages/:id", deleteMessageHandler, deleteMessagePresenter, endpointForward);

collaborationRoutes.post(
    "/read",
    markConversationReadValidator,
    markConversationReadHandler,
    markConversationReadPresenter,
    endpointForward,
);

export { collaborationRoutes };
