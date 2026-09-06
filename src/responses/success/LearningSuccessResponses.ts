export const LearningSuccessResponses = {
    DEFAULT: {
        message: "Learning request completed.",
        code: 200,
    },
    ORDER_CREATED: {
        message: "Order and ledger entry created; confirmation queued.",
        code: 201,
    },
    EXISTING_ORDER_RETURNED: {
        message: "The original response was reused; no second order was created.",
        code: 200,
    },
    BACKGROUND_JOB_STATUS_LOADED: {
        message: "Background job status loaded.",
        code: 200,
    },
    ORDER_LOADED_FROM_REDIS: {
        message: "Order loaded from Redis.",
        code: 200,
    },
    CACHE_MISS_ORDER_LOADED_FROM_MONGODB_AND_CACHED_FOR_60_SECONDS: {
        message: "Cache miss; order loaded from MongoDB and cached for 60 seconds.",
        code: 200,
    },
    OFFSET_PAGE_LOADED_WITH_SKIP_LIMIT: {
        message: "Offset page loaded with skip/limit.",
        code: 200,
    },
    CURSOR_PAGE_LOADED_WITH_AN_INDEXED_RANGE_QUERY: {
        message: "Cursor page loaded with an indexed range query.",
        code: 200,
    },
    MONGODB_QUERY_PLAN_LOADED: {
        message: "MongoDB query plan loaded.",
        code: 200,
    },
    ATOMIC_VERSION_CHECK_UPDATE_SUCCEEDED_REDIS_CACHE_INVALIDATED: {
        message: "Atomic version check/update succeeded; Redis cache invalidated.",
        code: 200,
    },
};
