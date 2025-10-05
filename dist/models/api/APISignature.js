"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APISignature = void 0;
class APISignature {
    id;
    createdAt;
    updatedAt;
    constructor(values) {
        this.id = values?.id;
        this.createdAt = values?.createdAt;
        this.updatedAt = values?.updatedAt;
    }
}
exports.APISignature = APISignature;
