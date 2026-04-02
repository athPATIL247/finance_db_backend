import { body } from 'express-validator';
import { RECORD_TYPES, CATEGORIES } from '../config/constants.js';

export const createRecordValidator = [
  body('amount')
    .notEmpty().withMessage('Amount is required.')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
  body('type')
    .notEmpty().withMessage('Type is required.')
    .isIn(Object.values(RECORD_TYPES)).withMessage(`Type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`),
  body('category')
    .notEmpty().withMessage('Category is required.')
    .isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('date')
    .notEmpty().withMessage('Date is required.')
    .isISO8601().withMessage('Date must be a valid ISO 8601 date.'),
  body('notes')
    .optional()
    .isString().withMessage('Notes must be text.'),
];

export const updateRecordValidator = [
  body('amount')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
  body('type')
    .optional()
    .isIn(Object.values(RECORD_TYPES)).withMessage(`Type must be one of: ${Object.values(RECORD_TYPES).join(', ')}`),
  body('category')
    .optional()
    .isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO 8601 date.'),
  body('notes')
    .optional()
    .isString().withMessage('Notes must be text.'),
];
