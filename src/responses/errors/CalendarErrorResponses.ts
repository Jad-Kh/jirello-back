export const CalendarErrorResponses = {
    VALIDATION_ERROR: {
        message: "Invalid calendar request.",
        code: 400,
    },
    CALENDAR_CHANGED_ELSEWHERE_OR_ACCESS_WAS_DENIED: {
        message: "Calendar changed elsewhere or access was denied.",
        code: 409,
    },
    CALENDAR_EVENT_DELETION_ACCESS_DENIED: {
        message: "Calendar event deletion access denied.",
        code: 403,
    },
    CALENDAR_EVENT_CHANGED_ELSEWHERE_RELOAD_AND_RETRY: {
        message: "Calendar event changed elsewhere. Reload and retry.",
        code: 409,
    },
    RECURRING_OCCURRENCE_DELETION_ACCESS_DENIED: {
        message: "Recurring occurrence deletion access denied.",
        code: 403,
    },
    CALENDAR_SERIES_CHANGED_ELSEWHERE_RELOAD_AND_RETRY: {
        message: "Calendar series changed elsewhere. Reload and retry.",
        code: 409,
    },
    AVAILABILITY_RANGE_MUST_BE_POSITIVE_AND_NO_LONGER_THAN_31_DAYS: {
        message: "Availability range must be positive and no longer than 31 days.",
        code: 400,
    },
    TEAM_AVAILABILITY_ACCESS_DENIED: {
        message: "Team availability access denied.",
        code: 403,
    },
    CALENDAR_COLLECTION_ACCESS_DENIED: {
        message: "Calendar collection access denied.",
        code: 403,
    },
    CALENDAR_RANGE_MUST_BE_POSITIVE_AND_NO_LONGER_THAN_366_DAYS: {
        message: "Calendar range must be positive and no longer than 366 days.",
        code: 400,
    },
    CALENDAR_SCOPE_ACCESS_DENIED: {
        message: "Calendar scope access denied.",
        code: 403,
    },
    ONLY_THE_CALENDAR_OWNER_CAN_UPDATE_IT: {
        message: "Only the calendar owner can update it.",
        code: 403,
    },
    CALENDAR_TIMEZONE_IS_INVALID: {
        message: "Calendar timezone is invalid.",
        code: 400,
    },
    PERSONAL_CALENDARS_CANNOT_BE_SHARED_WITH_MEMBERS: {
        message: "Personal calendars cannot be shared with members.",
        code: 400,
    },
    CALENDAR_CHANGED_ELSEWHERE_RELOAD_AND_RETRY: {
        message: "Calendar changed elsewhere. Reload and retry.",
        code: 409,
    },
    CALENDAR_EVENT_NOT_FOUND: {
        message: "Calendar event not found.",
        code: 404,
    },
    CALENDAR_EVENT_UPDATE_ACCESS_DENIED: {
        message: "Calendar event update access denied.",
        code: 403,
    },
    RECURRING_OCCURRENCE_UPDATE_ACCESS_DENIED: {
        message: "Recurring occurrence update access denied.",
        code: 403,
    },
    RECURRING_OCCURRENCE_NOT_FOUND: {
        message: "Recurring occurrence not found.",
        code: 404,
    },
    CALENDAR_OCCURRENCE_END_MUST_BE_AFTER_ITS_START: {
        message: "Calendar occurrence end must be after its start.",
        code: 400,
    },
    PROJECT_CALENDARS_REQUIRE_THEIR_COMMUNITY_ID: {
        message: "Project calendars require their community ID.",
        code: 400,
    },
    SHARED_CALENDARS_REQUIRE_A_COMMUNITY: {
        message: "Shared calendars require a community.",
        code: 400,
    },
    CALENDAR_CREATION_ACCESS_DENIED: {
        message: "Calendar creation access denied.",
        code: 403,
    },
    CALENDAR_INVITATION_ACCESS_DENIED: {
        message: "Calendar invitation access denied.",
        code: 403,
    },
};
