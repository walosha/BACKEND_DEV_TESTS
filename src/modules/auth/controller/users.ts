/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email address
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         name: John Doe
 *         email: johndoe@example.com
 *         password: password123
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email address
 *         password:
 *           type: string
 *           description: The user password
 *       example:
 *         email: johndoe@example.com
 *         password: password123
 */

import express from 'express';
import { deleteUser, fetchUsers } from '../service';
import { protect, restrictTo } from '../../../middleware';
const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       "401":
 *         description: Unauthorized
 */

router.get('/', restrictTo('admin'), fetchUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       "204":
 *         description: User deleted successfully
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: User not found
 */

router.delete('/:id', deleteUser);

export default router;
