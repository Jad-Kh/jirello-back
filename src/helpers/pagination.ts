type PaginationParams = {
    page?: unknown;
    limit?: unknown;
};

const preparePagination = (params: PaginationParams) => {
    const requestedPage = Number(params.page);
    const requestedLimit = Number(params.limit);
    const pageNumber = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const pageSize =
        Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 100) : 10;
    const skip = (pageNumber - 1) * pageSize;
    return { skip, limit: pageSize };
};

export { preparePagination };
