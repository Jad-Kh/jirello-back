"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = exports.handleError = void 0;
const errorResponsePresenter_1 = require("../presenters/common/errorResponsePresenter");
const errorLog_1 = require("../errorLog/errorLog");
const CommonErrorResponses_ts_1 = require("../responses/errors/CommonErrorResponses.ts");
const handleError = (res, errorType, message, caller, log) => {
    if (log)
        (0, errorLog_1.prepareErrorLog)(message || errorType.message, caller.name);
    return res.status(errorType.code).json((0, errorResponsePresenter_1.prepareErrorResponse)(errorType, message));
};
exports.handleError = handleError;
const catchError = (error, res, caller) => {
    (0, errorLog_1.prepareErrorLog)(error, caller);
    return res.status(CommonErrorResponses_ts_1.CommonErrorResponses.SERVER_ERROR.code).json((0, errorResponsePresenter_1.prepareErrorResponse)(CommonErrorResponses_ts_1.CommonErrorResponses.SERVER_ERROR, null));
};
exports.catchError = catchError;
