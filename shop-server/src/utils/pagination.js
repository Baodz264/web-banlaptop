class Pagination {
  static getPagination(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const offset = (page - 1) * limit;

    return {
      page,
      limit,
      offset,
    };
  }

  static getPagingData(data, page, limit) {
    const { count: totalItems, rows } = data;

    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      totalItems,
      totalPages,
      currentPage,
      items: rows,
    };
  }
}

export default Pagination;
