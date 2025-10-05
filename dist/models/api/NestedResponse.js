"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedResponse = void 0;
class NestedResponse {
    data;
    children;
    constructor(values) {
        this.data = values.data;
        this.children = values?.children;
    }
}
exports.NestedResponse = NestedResponse;
