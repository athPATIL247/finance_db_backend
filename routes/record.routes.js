import { Router } from 'express';
import * as RecordController from '../controllers/record.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createRecordValidator, updateRecordValidator } from '../validators/record.validator.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Financial records management
 */

/**
 * @swagger
 * /records:
 *   post:
 *     tags: [Records]
 *     summary: Create a financial record (admin/analyst)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount: { type: number, example: 5000 }
 *               type: { type: string, enum: [income, expense] }
 *               category: { type: string, example: salary }
 *               date: { type: string, example: "2025-01-15" }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Created }
 *       403: { description: Forbidden }
 */
router.post(
  '/',
  authenticate,
  authorize('admin', 'analyst'),
  createRecordValidator,
  validate,
  RecordController.createRecord
);

/**
 * @swagger
 * /records:
 *   get:
 *     tags: [Records]
 *     summary: Get all financial records (filtered, paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [income, expense] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: date_from
 *         schema: { type: string }
 *       - in: query
 *         name: date_to
 *         schema: { type: string }
 *       - in: query
 *         name: min_amount
 *         schema: { type: number }
 *       - in: query
 *         name: max_amount
 *         schema: { type: number }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated list }
 */
router.get('/', authenticate, RecordController.getRecords);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     tags: [Records]
 *     summary: Get single record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Record found }
 *       404: { description: Not found }
 */
router.get('/:id', authenticate, RecordController.getRecordById);

/**
 * @swagger
 * /records/{id}:
 *   patch:
 *     tags: [Records]
 *     summary: Update a financial record (admin/analyst)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated }
 */
router.patch(
  '/:id',
  authenticate,
  authorize('admin', 'analyst'),
  updateRecordValidator,
  validate,
  RecordController.updateRecord
);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     tags: [Records]
 *     summary: Soft delete a record (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', authenticate, authorize('admin'), RecordController.deleteRecord);

export default router;