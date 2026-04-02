import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User } from '../models/index.js';
import { logAudit } from '../utils/audit.js';
import { AUDIT_ACTIONS, ROLES, USER_STATUS } from '../config/constants.js';
import { sanitizeUser } from './auth.service.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';

export const createUser = async (data, actorId) => {
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) throw Object.assign(new Error('Email already in use.'), { statusCode: 409 });

  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hashedPassword = await bcrypt.hash(data.password, rounds);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || ROLES.VIEWER,
    status: data.status || USER_STATUS.ACTIVE,
  });

  await logAudit(actorId, AUDIT_ACTIONS.CREATE, 'users', user.id, {
    email: user.email,
    role: user.role,
    status: user.status,
  });

  return sanitizeUser(user);
};

export const getAllUsers = async (query) => {
  const { page, limit, offset } = getPagination(query);
  const where = { deleted_at: null };

  if (query.role) where.role = query.role;
  if (query.status) where.status = query.status;
  if (query.search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query.search}%` } },
      { email: { [Op.iLike]: `%${query.search}%` } },
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
    attributes: { exclude: ['password'] },
  });

  return {
    users: rows,
    pagination: buildPaginationMeta(count, page, limit),
  };
};

export const getUserById = async (id) => {
  const user = await User.findOne({
    where: { id, deleted_at: null },
    attributes: { exclude: ['password'] },
  });
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 404 });
  return user;
};

export const updateUser = async (id, updates, actorId) => {
  const user = await User.findOne({ where: { id, deleted_at: null } });
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 404 });

  const oldValues = sanitizeUser(user);

  if (updates.password) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    updates.password = await bcrypt.hash(updates.password, rounds);
  }

  await user.update(updates);
  await logAudit(actorId, AUDIT_ACTIONS.UPDATE, 'users', id, { old: oldValues, new: updates });

  return sanitizeUser(user);
};

export const softDeleteUser = async (id, actorId) => {
  const user = await User.findOne({ where: { id, deleted_at: null } });
  if (!user) throw Object.assign(new Error('User not found.'), { statusCode: 404 });

  await user.update({ deleted_at: new Date(), status: 'inactive' });
  await logAudit(actorId, AUDIT_ACTIONS.DELETE, 'users', id, { email: user.email });
};