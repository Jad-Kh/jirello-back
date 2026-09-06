export const TaskErrorResponses = {
    VALIDATION_ERROR: {
        message: "Invalid task request.",
        code: 400,
    },
    INVALID_TASK_ID: {
        message: "Invalid task ID.",
        code: 400,
    },
    PROJECT_TASK_ACCESS_DENIED: {
        message: "Project task access denied.",
        code: 403,
    },
    INVALID_PROJECT_ID: {
        message: "Invalid project ID.",
        code: 400,
    },
    TASK_USERS_MUST_BELONG_TO_THE_COMMUNITY: {
        message: "Task users must belong to the community.",
        code: 400,
    },
    TASK_RELATIONSHIPS_MUST_REFERENCE_OTHER_TASKS_IN_THE_SAME_PROJECT: {
        message: "Task relationships must reference other tasks in the same project.",
        code: 400,
    },
    TASK_DEPENDENCIES_CANNOT_FORM_A_CYCLE: {
        message: "Task dependencies cannot form a cycle.",
        code: 400,
    },
    TASK_HIERARCHY_CANNOT_FORM_A_CYCLE: {
        message: "Task hierarchy cannot form a cycle.",
        code: 400,
    },
    TASK_CHANGED_ELSEWHERE_RELOAD_AND_RETRY: {
        message: "Task changed elsewhere. Reload and retry.",
        code: 409,
    },
    TASK_REORDER_ACCESS_DENIED: {
        message: "Task reorder access denied.",
        code: 403,
    },
    A_TASK_CHANGED_ELSEWHERE_RELOAD_AND_RETRY: {
        message: "A task changed elsewhere. Reload and retry.",
        code: 409,
    },
    IDEMPOTENCY_KEY_MUST_BE_AT_MOST_128_LETTERS_NUMBERS_DOTS_COLONS_PLUSES_UNDERSCORES_OR_HYPHENS: {
        message:
            "Idempotency-Key must be at most 128 letters, numbers, dots, colons, pluses, underscores, or hyphens.",
        code: 400,
    },
    THIS_IDEMPOTENCY_KEY_WAS_ALREADY_USED_WITH_A_DIFFERENT_TASK_REQUEST: {
        message: "This Idempotency-Key was already used with a different task request.",
        code: 409,
    },
    TASK_RELATIONSHIPS_MUST_REFERENCE_TASKS_IN_THE_SAME_PROJECT: {
        message: "Task relationships must reference tasks in the same project.",
        code: 400,
    },
};
