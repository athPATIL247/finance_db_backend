import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { sendError } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access token is required.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: { id: decoded.id, deleted_at: null },
    });

    if (!user) return sendError(res, 'User not found or has been deleted.', 401);
    if (user.status === 'inactive') return sendError(res, 'Account is inactive.', 403);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return sendError(res, 'Token has expired.', 401);
    if (err.name === 'JsonWebTokenError') return sendError(res, 'Invalid token.', 401);
    next(err);
  }
};

// Usage: authorize('admin') or authorize('admin', 'analyst')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
        403
      );
    }
    next();
  };
};