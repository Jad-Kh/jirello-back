"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareErrorResponse = void 0;
const responseHelper_js_1 = require("../../responses/responseHelper.js");
const ErrorResponse_ts_1 = require("../../models/api/ErrorResponse.ts");
const prepareErrorResponse = (errorStatus, message) => {
    const model = new ErrorResponse_ts_1.ErrorResponse({
        message: message ?? errorStatus.message,
        code: errorStatus.code,
    });
    return (0, responseHelper_js_1.cleanUpModel)(model);
};
exports.prepareErrorResponse = prepareErrorResponse;
