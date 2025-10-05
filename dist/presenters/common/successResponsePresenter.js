"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareSuccessResponse = void 0;
const responseHelper_js_1 = require("../../responses/responseHelper.js");
const SuccessResponse_ts_1 = require("../../models/api/SuccessResponse.ts");
const prepareSuccessResponse = (successStatus, message, data) => {
    const model = new SuccessResponse_ts_1.SuccessResponse({
        data: data,
        message: message ?? successStatus.message,
        code: successStatus.code,
    });
    return (0, responseHelper_js_1.cleanUpModel)(model);
};
exports.prepareSuccessResponse = prepareSuccessResponse;
