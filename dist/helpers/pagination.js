"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preparePagination = void 0;
const preparePagination = (params) => {
    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const pageNumber = parseInt(page.toString()) || 1;
    const pageSize = parseInt(limit.toString()) || 10;
    const skip = (pageNumber - 1) * pageSize;
    return { skip, limit: pageSize };
};
exports.preparePagination = preparePagination;
