import * as UserService from '../services/user.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export const createUser = async (req, res, next) => {
  try {
    const created = await UserService.createUser(req.body, req.user.id);
    return sendSuccess(res, 'User created.', created, 201);
  } catch (err) { next(err); }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { users, pagination } = await UserService.getAllUsers(req.query);
    return sendPaginated(res, 'Users retrieved.', users, pagination);
  } catch (err) { next(err); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    return sendSuccess(res, 'User retrieved.', user);
  } catch (err) { next(err); }
};

export const updateUser = async (req, res, next) => {
  try {
    const updated = await UserService.updateUser(req.params.id, req.body, req.user.id);
    return sendSuccess(res, 'User updated.', updated);
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await UserService.softDeleteUser(req.params.id, req.user.id);
    return sendSuccess(res, 'User deleted successfully.');
  } catch (err) { next(err); }
};