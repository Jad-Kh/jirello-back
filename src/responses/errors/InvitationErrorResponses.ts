export const InvitationErrorResponses = {
    VALIDATION_ERROR: {
        message: "Invalid invitation request.",
        code: 400,
    },
    ACTIVE_INVITATION_NOT_FOUND: {
        message: "Active invitation not found.",
        code: 404,
    },
    INVITATION_WAS_ALREADY_HANDLED: {
        message: "Invitation was already handled.",
        code: 409,
    },
    COMMUNITY_INVITATION_ACCESS_DENIED: {
        message: "Community invitation access denied.",
        code: 403,
    },
    USER_IS_ALREADY_A_COMMUNITY_MEMBER: {
        message: "User is already a community member.",
        code: 409,
    },
    A_PENDING_INVITATION_ALREADY_EXISTS: {
        message: "A pending invitation already exists.",
        code: 409,
    },
};
