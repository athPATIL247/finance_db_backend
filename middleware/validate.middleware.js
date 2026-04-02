import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
    });
  }
  next();
};