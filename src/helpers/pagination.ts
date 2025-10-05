const preparePagination = (params) => {
    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const pageNumber = parseInt(page.toString()) || 1;
    const pageSize = parseInt(limit.toString()) || 10;
    const skip = (pageNumber - 1) * pageSize;
    return { skip, limit: pageSize };
};

export {
    preparePagination
}