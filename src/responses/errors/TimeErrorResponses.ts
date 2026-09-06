export const TimeErrorResponses = {
    VALIDATION_ERROR: {
        message: "Invalid time request.",
        code: 400,
    },
    CAPACITY_ACCESS_DENIED: {
        message: "Capacity access denied.",
        code: 403,
    },
    TIME_ENTRY_ACCESS_DENIED: {
        message: "Time entry access denied.",
        code: 403,
    },
    ONLY_MANAGERS_CAN_READ_ANOTHER_MEMBER_S_TIME: {
        message: "Only managers can read another member's time.",
        code: 403,
    },
    WORKLOAD_ACCESS_DENIED: {
        message: "Workload access denied.",
        code: 403,
    },
    TIME_ENTRY_CANNOT_BE_EDITED: {
        message: "Time entry cannot be edited.",
        code: 403,
    },
    TIME_ENTRY_END_MUST_BE_AFTER_ITS_START: {
        message: "Time entry end must be after its start.",
        code: 400,
    },
    TIME_ENTRY_CHANGED_ELSEWHERE_RELOAD_AND_RETRY: {
        message: "Time entry changed elsewhere. Reload and retry.",
        code: 409,
    },
    TIMESHEET_REVIEW_ACCESS_DENIED: {
        message: "Timesheet review access denied.",
        code: 403,
    },
    STOP_THE_ACTIVE_TIMER_BEFORE_STARTING_ANOTHER_ONE: {
        message: "Stop the active timer before starting another one.",
        code: 409,
    },
    TIMESHEET_ACCESS_DENIED: {
        message: "Timesheet access denied.",
        code: 403,
    },
    CAPACITY_UPDATE_ACCESS_DENIED: {
        message: "Capacity update access denied.",
        code: 403,
    },
};
