/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           format: email
 *           description: The user email address
 *         password:
 *           type: string
 *           description: The user password (hashed)
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: The user role
 *           default: user
 *       example:
 *         name: John Doe
 *         email: johndoe@example.com
 *         password: $2a$10$gR06R4K1NM4p4b4ELq.LlOTzq3Dcxj2iPwE5U/O2MDE70o9noemhO
 *         role: user
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

router.get('/', protect, restrictTo('admin'), fetchUsers);

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
// A simple case where users can only delete themselves not the admin

router.delete('/:id', restrictTo('user'), deleteUser);

export default router;
