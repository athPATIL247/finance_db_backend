/**
 * Extracts and sanitises pagination params from query string.
 */
export const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Builds a pagination metadata object.
 */
export const buildPaginationMeta = (count, page, limit) => ({
  total: count,
  page,
  limit,
  totalPages: Math.ceil(count / limit),
  hasNext: page * limit < count,
  hasPrev: page > 1,
});