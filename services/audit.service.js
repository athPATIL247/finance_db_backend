import { AuditLog, User } from '../models/index.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';

export const getAuditLogs = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = {};

  if (query.user_id) where.user_id = query.user_id;
  if (query.action) where.action = query.action;
  if (query.entity) where.entity = query.entity;

  const { count, rows } = await AuditLog.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    include: [{ model: User, as: 'actor', attributes: ['id', 'name', 'email', 'role'] }],
  });

  return {
    logs: rows,
    pagination: buildPaginationMeta(count, page, limit),
  };
};