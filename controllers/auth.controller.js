import * as AuthService from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const result = await AuthService.registerUser(req.body);
    return sendSuccess(res, 'Registration successful.', result, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await AuthService.loginUser(req.body);
    return sendSuccess(res, 'Login successful.', result);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return sendError(res, 'Refresh token is required.', 400);
    const tokens = await AuthService.refreshAccessToken(refreshToken);
    return sendSuccess(res, 'Token refreshed.', tokens);
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res) => {
  const { password, ...user } = req.user.toJSON();
  return sendSuccess(res, 'Authenticated user.', user);
};