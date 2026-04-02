import { Op } from 'sequelize';
import { FinancialRecord, User } from '../models/index.js';
import { logAudit } from '../utils/audit.js';
import { AUDIT_ACTIONS } from '../config/constants.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';

export const createRecord = async (data, userId) => {
  const record = await FinancialRecord.create({ ...data, user_id: userId });
  await logAudit(userId, AUDIT_ACTIONS.CREATE, 'financial_records', record.id, { amount: data.amount, type: data.type });
  return record;
};

export const getRecords = async (query, user) => {
  const { page, limit, offset } = getPagination(query);
  const where = { deleted_at: null };

  // Viewers and analysts see only their own records; admins see all
  if (user.role !== 'admin') where.user_id = user.id;

  if (query.type) where.type = query.type;
  if (query.category) where.category = query.category;
  if (query.date_from || query.date_to) {
    where.date = {};
    if (query.date_from) where.date[Op.gte] = query.date_from;
    if (query.date_to) where.date[Op.lte] = query.date_to;
  }
  if (query.search) {
    where.notes = { [Op.iLike]: `%${query.search}%` };
  }
  if (query.min_amount || query.max_amount) {
    where.amount = {};
    if (query.min_amount) where.amount[Op.gte] = parseFloat(query.min_amount);
    if (query.max_amount) where.amount[Op.lte] = parseFloat(query.max_amount);
  }

  const { count, rows } = await FinancialRecord.findAndCountAll({
    where,
    limit,
    offset,
    order: [['date', 'DESC'], ['created_at', 'DESC']],
    include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
  });

  return {
    records: rows,
    pagination: buildPaginationMeta(count, page, limit),
  };
};

export const getRecordById = async (id, user) => {
  const where = { id, deleted_at: null };
  if (user.role !== 'admin') where.user_id = user.id;

  const record = await FinancialRecord.findOne({
    where,
    include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
  });
  if (!record) throw Object.assign(new Error('Record not found.'), { statusCode: 404 });
  return record;
};

export const updateRecord = async (id, data, user) => {
  const where = { id, deleted_at: null };
  // Only admin can update any record; analyst/viewer can only update their own
  if (user.role !== 'admin') where.user_id = user.id;

  const record = await FinancialRecord.findOne({ where });
  if (!record) throw Object.assign(new Error('Record not found or access denied.'), { statusCode: 404 });

  const old = record.toJSON();
  await record.update(data);
  await logAudit(user.id, AUDIT_ACTIONS.UPDATE, 'financial_records', id, { old, new: data });

  return record;
};

export const softDeleteRecord = async (id, user) => {
  const where = { id, deleted_at: null };
  if (user.role !== 'admin') where.user_id = user.id;

  const record = await FinancialRecord.findOne({ where });
  if (!record) throw Object.assign(new Error('Record not found or access denied.'), { statusCode: 404 });

  await record.update({ deleted_at: new Date() });
  await logAudit(user.id, AUDIT_ACTIONS.DELETE, 'financial_records', id, {});
};