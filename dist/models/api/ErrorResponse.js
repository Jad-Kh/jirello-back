"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse {
    message;
    code;
    constructor(values) {
        this.message = values.message;
        this.code = values.code;
    }
}
exports.ErrorResponse = ErrorResponse;
