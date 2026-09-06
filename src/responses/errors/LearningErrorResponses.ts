export const LearningErrorResponses = {
    VALIDATION_ERROR: {
        message: "Invalid learning request.",
        code: 400,
    },
    USE_MODE_SYNC_WORKER_AND_A_VALID_LIMIT: {
        message: "Use mode sync/worker and a valid limit.",
        code: 400,
    },
    INVALID_ORDER_ID: {
        message: "Invalid order ID.",
        code: 400,
    },
    ORDER_NOT_FOUND: {
        message: "Order not found.",
        code: 404,
    },
    INVALID_PAGINATION_CURSOR: {
        message: "Invalid pagination cursor.",
        code: 400,
    },
    VERSION_CONFLICT_ANOTHER_UPDATE_WON_THE_RACE: {
        message: "Version conflict: another update won the race.",
        code: 409,
    },
    A_VALID_IDEMPOTENCY_KEY_HEADER_IS_REQUIRED: {
        message: "A valid Idempotency-Key header is required.",
        code: 400,
    },
    THAT_CLIENT_REFERENCE_ALREADY_BELONGS_TO_ANOTHER_ORDER: {
        message: "That client reference already belongs to another order.",
        code: 409,
    },
    THIS_IDEMPOTENCY_KEY_WAS_ALREADY_USED_WITH_A_DIFFERENT_REQUEST: {
        message: "This idempotency key was already used with a different request.",
        code: 409,
    },
};
