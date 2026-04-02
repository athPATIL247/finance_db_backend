import { body } from 'express-validator';
import { ROLES, USER_STATUS } from '../config/constants.js';

export const createUserValidator = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.')
    .matches(/\d/)
    .withMessage('Password must contain at least one number.'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
  body('status')
    .optional()
    .isIn(Object.values(USER_STATUS))
    .withMessage(`Status must be one of: ${Object.values(USER_STATUS).join(', ')}`),
];

export const updateUserValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters.'),
  body('email').optional().trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.')
    .matches(/\d/)
    .withMessage('Password must contain at least one number.'),
  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`),
  body('status')
    .optional()
    .isIn(Object.values(USER_STATUS))
    .withMessage(`Status must be one of: ${Object.values(USER_STATUS).join(', ')}`),
];
