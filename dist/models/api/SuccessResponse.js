"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = void 0;
class SuccessResponse {
    data;
    message;
    code;
    constructor(values) {
        this.data = values?.data;
        this.message = values.message;
        this.code = values.code;
    }
}
exports.SuccessResponse = SuccessResponse;
