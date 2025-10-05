const CommonErrorResponses = {
    SERVER_ERROR: {
        message: 'Server Error',
        code: 400
    },
    REQUIRED: {
        message: 'Field required',
        code: 400
    },
    UNAUTHORIZED: {
        message: 'No Authentication found',
        code: 401
    },
    PAYMENT_REQUIRED: {
        message: 'Payment required',
        code: 402
    },
    FORBIDDEN: {
        message: 'Access Denied',
        code: 403
    },
    NOT_FOUND: {
        message: 'Not found',
        code: 404
    },
    NO_ID: {
        message: 'No Id found',
        code: 404,
    }
}

export {
    CommonErrorResponses
}