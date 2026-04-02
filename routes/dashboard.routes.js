import { Router } from 'express';
import * as DashboardController from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary and analytics
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard summary (income, expenses, net balance)
 *     responses:
 *       200: { description: Summary retrieved }
 */
router.get('/summary', authenticate, DashboardController.getSummary);

/**
 * @swagger
 * /dashboard/categories:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get category-wise totals (admin/analyst)
 *     responses:
 *       200: { description: Category totals retrieved }
 */
router.get('/categories', authenticate, authorize('admin', 'analyst'), DashboardController.getCategoryTotals);

/**
 * @swagger
 * /dashboard/trends/monthly:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get monthly trend data (admin/analyst)
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *         description: Year for the monthly trend
 *     responses:
 *       200: { description: Monthly trends retrieved }
 */
router.get('/trends/monthly', authenticate, authorize('admin', 'analyst'), DashboardController.getMonthlyTrends);

/**
 * @swagger
 * /dashboard/trends/weekly:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get weekly trend data (admin/analyst)
 *     responses:
 *       200: { description: Weekly trends retrieved }
 */
router.get('/trends/weekly', authenticate, authorize('admin', 'analyst'), DashboardController.getWeeklyTrends);

/**
 * @swagger
 * /dashboard/recent:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get recent activity (admin/analyst)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: Maximum number of recent records to return
 *     responses:
 *       200: { description: Recent activity retrieved }
 */
router.get('/recent', authenticate, authorize('admin', 'analyst'), DashboardController.getRecentActivity);

export default router;
