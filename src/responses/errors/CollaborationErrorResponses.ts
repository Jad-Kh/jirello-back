export const CollaborationErrorResponses = {
    VALIDATION_ERROR: {
        message: "Invalid collaboration request.",
        code: 400,
    },
    INVALID_MESSAGE_ID: {
        message: "Invalid message ID.",
        code: 400,
    },
    MESSAGE_NOT_FOUND: {
        message: "Message not found.",
        code: 404,
    },
    MESSAGE_DELETION_DENIED: {
        message: "Message deletion denied.",
        code: 403,
    },
    CONVERSATION_ACCESS_DENIED: {
        message: "Conversation access denied.",
        code: 403,
    },
    MESSAGE_REPORT_ACCESS_DENIED: {
        message: "Message report access denied.",
        code: 403,
    },
    MESSAGE_UPDATE_DENIED: {
        message: "Message update denied.",
        code: 403,
    },
    MENTIONED_USERS_MUST_BELONG_TO_THE_COMMUNITY: {
        message: "Mentioned users must belong to the community.",
        code: 400,
    },
    MESSAGE_CHANGED_ELSEWHERE_RELOAD_AND_RETRY: {
        message: "Message changed elsewhere. Reload and retry.",
        code: 409,
    },
    MESSAGE_REPORT_REVIEW_DENIED: {
        message: "Message report review denied.",
        code: 403,
    },
    MESSAGE_REPORTING_DENIED: {
        message: "Message reporting denied.",
        code: 403,
    },
    PARENT_MESSAGE_MUST_BELONG_TO_THIS_CONVERSATION: {
        message: "Parent message must belong to this conversation.",
        code: 400,
    },
};
