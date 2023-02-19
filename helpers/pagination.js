const preparePagination = (params) => {
    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const limitValue = pageSize;
  
    return { skip, limit: limitValue };
};

export {
    preparePagination
}