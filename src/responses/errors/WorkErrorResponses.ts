export const WorkErrorResponses = {
    VALIDATION_ERROR: {
        message: "Invalid work request.",
        code: 400,
    },
    WORK_CONFIGURATION_ACCESS_DENIED: {
        message: "Work configuration access denied.",
        code: 403,
    },
    TEMPLATE_ACCESS_DENIED: {
        message: "Template access denied.",
        code: 403,
    },
    ONLY_THE_VIEW_OWNER_CAN_DELETE_IT: {
        message: "Only the view owner can delete it.",
        code: 403,
    },
    SAVED_VIEW_ACCESS_DENIED: {
        message: "Saved view access denied.",
        code: 403,
    },
    WORK_CONFIGURATION_CHANGED_ELSEWHERE_RELOAD_AND_RETRY: {
        message: "Work configuration changed elsewhere. Reload and retry.",
        code: 409,
    },
    ONLY_THE_VIEW_OWNER_CAN_UPDATE_IT: {
        message: "Only the view owner can update it.",
        code: 403,
    },
    ONLY_COMMUNITY_MANAGERS_CAN_PUBLISH_SHARED_VIEWS: {
        message: "Only community managers can publish shared views.",
        code: 403,
    },
    ONLY_COMMUNITY_MANAGERS_CAN_CONFIGURE_WORK_TYPES: {
        message: "Only community managers can configure work types.",
        code: 403,
    },
    EVERY_TRANSITION_MUST_REFERENCE_A_DECLARED_STATUS: {
        message: "Every transition must reference a declared status.",
        code: 400,
    },
};
