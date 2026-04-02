import { Router } from 'express';
import * as AuditController from '../controllers/audit.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Audit
 *   description: Audit trail (admin only)
 */

/**
 * @swagger
 * /audit:
 *   get:
 *     tags: [Audit]
 *     summary: Get audit logs (admin only)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: action
 *         schema: { type: string, enum: [CREATE, UPDATE, DELETE, LOGIN, REGISTER] }
 *       - in: query
 *         name: entity
 *         schema: { type: string }
 *       - in: query
 *         name: user_id
 *         schema: { type: string }
 *     responses:
 *       200: { description: Audit logs }
 *       403: { description: Forbidden }
 */
router.get('/', authenticate, authorize('admin'), AuditController.getAuditLogs);

export default router;