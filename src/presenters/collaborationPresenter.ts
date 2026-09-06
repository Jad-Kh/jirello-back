import { createPresenter } from "../helpers/presenting.js";
import { CollaborationMessageResponse } from "../models/collaboration/CollaborationMessageResponse.js";
import { CollaborationMessagesPageResponse } from "../models/collaboration/CollaborationMessagesPageResponse.js";
import { MessageReportResponse } from "../models/collaboration/MessageReportResponse.js";
import { MessageReportsResponse } from "../models/collaboration/MessageReportsResponse.js";
import { CollaborationSuccessResponses } from "../responses/success/CollaborationSuccessResponses.js";

export const deleteMessagePresenter = createPresenter(CollaborationSuccessResponses.MESSAGE_DELETED);
export const getMessagesPresenter = createPresenter(
    CollaborationSuccessResponses.MESSAGES_LOADED,
    CollaborationMessagesPageResponse,
);
export const getMessageReportsPresenter = createPresenter(
    CollaborationSuccessResponses.MESSAGE_REPORTS_LOADED,
    MessageReportsResponse,
);
export const updateMessagePresenter = createPresenter(
    CollaborationSuccessResponses.MESSAGE_UPDATED,
    CollaborationMessageResponse,
);
export const reviewMessageReportPresenter = createPresenter(
    CollaborationSuccessResponses.MESSAGE_REPORT_REVIEWED,
    MessageReportResponse,
);
export const reportMessagePresenter = createPresenter(
    CollaborationSuccessResponses.MESSAGE_REPORT_SUBMITTED,
    MessageReportResponse,
);
export const createMessagePresenter = createPresenter(
    CollaborationSuccessResponses.MESSAGE_CREATED,
    CollaborationMessageResponse,
);
export const markConversationReadPresenter = createPresenter(
    CollaborationSuccessResponses.CONVERSATION_MARKED_AS_READ,
);
