import { Router } from 'express';
import * as UserController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createUserValidator, updateUserValidator } from '../validators/user.validator.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (admin only)
 */

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [viewer, analyst, admin] }
 *               status: { type: string, enum: [active, inactive] }
 *     responses:
 *       201: { description: User created }
 */
router.post('/', authenticate, authorize('admin'), createUserValidator, validate, UserController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (admin only)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [viewer, analyst, admin] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, inactive] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of users }
 */
router.post('/', authenticate, authorize('admin'), createUserValidator, validate, UserController.createUser);
router.get('/', authenticate, authorize('admin'), UserController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: User found }
 *       404: { description: Not found }
 */
router.get('/:id', authenticate, authorize('admin'), UserController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user role/status (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               role: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Updated }
 */
router.patch('/:id', authenticate, authorize('admin'), updateUserValidator, validate, UserController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Soft delete a user (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', authenticate, authorize('admin'), UserController.deleteUser);

export default router;