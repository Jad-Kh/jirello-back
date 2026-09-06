import type { GetMessagesRequest } from "../handlers/collaboration/getMessagesHandler/getMessagesRequest.js";
import type { CreateMessageRequest } from "../handlers/collaboration/createMessageHandler/createMessageRequest.js";
import type { ReportMessageRequest } from "../handlers/collaboration/reportMessageHandler/reportMessageRequest.js";
import type { ReviewMessageReportRequest } from "../handlers/collaboration/reviewMessageReportHandler/reviewMessageReportRequest.js";
import type { UpdateMessageRequest } from "../handlers/collaboration/updateMessageHandler/updateMessageRequest.js";
import type { MarkConversationReadRequest } from "../handlers/collaboration/markConversationReadHandler/markConversationReadRequest.js";
import { createValidator } from "../helpers/validator.js";
import { CollaborationErrorResponses } from "../responses/errors/CollaborationErrorResponses.js";
import {
    collaborationScopeValidationScheme,
    updateMessageValidationScheme,
    reviewMessageReportValidationScheme,
    reportMessageValidationScheme,
    createMessageValidationScheme,
    getMessagesValidationScheme,
} from "./schemes/collaborationValidationSchemes.js";

export const getMessagesValidator = createValidator<GetMessagesRequest>(
    getMessagesValidationScheme,
    CollaborationErrorResponses.VALIDATION_ERROR,
);

export const updateMessageValidator = createValidator<UpdateMessageRequest>(
    updateMessageValidationScheme,
    CollaborationErrorResponses.VALIDATION_ERROR,
);

export const reviewMessageReportValidator = createValidator<ReviewMessageReportRequest>(
    reviewMessageReportValidationScheme,
    CollaborationErrorResponses.VALIDATION_ERROR,
);

export const reportMessageValidator = createValidator<ReportMessageRequest>(
    reportMessageValidationScheme,
    CollaborationErrorResponses.VALIDATION_ERROR,
);

export const createMessageValidator = createValidator<CreateMessageRequest>(
    createMessageValidationScheme,
    CollaborationErrorResponses.VALIDATION_ERROR,
);

export const markConversationReadValidator = createValidator<MarkConversationReadRequest>(
    collaborationScopeValidationScheme,
    CollaborationErrorResponses.VALIDATION_ERROR,
);
