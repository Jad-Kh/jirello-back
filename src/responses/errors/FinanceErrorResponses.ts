export const FinanceErrorResponses = {
    VALIDATION_ERROR: {
        message: "Invalid finance request.",
        code: 400,
    },
    PROJECT_FINANCIAL_ACCESS_DENIED: {
        message: "Project financial access denied.",
        code: 403,
    },
    PROJECT_FINANCIAL_UPDATE_ACCESS_DENIED: {
        message: "Project financial update access denied.",
        code: 403,
    },
    FINANCIAL_RATES_CAN_ONLY_REFERENCE_COMMUNITY_MEMBERS: {
        message: "Financial rates can only reference community members.",
        code: 400,
    },
};
