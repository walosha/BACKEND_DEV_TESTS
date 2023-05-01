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
import { getMe, login, refresh, signup } from '../service';
import { refreshMiddleware } from '../../../middleware/refresh';
import { protect } from '../../../middleware';
const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Creates an account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       "200":
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.post('/signup', signup);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       "200":
 *         description: The authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refreshes the access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh
 *             properties:
 *               refresh:
 *                 type: string
 *                 description: Refresh token
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGYwMjg0MWRmNGJlYzliOWI3ZjlhYSIsImlhdCI6MTY4Mjg5OTU4OCwiZXhwIjoxNjgzMDcyMzg4fQ.Bt2kzyxyUEtUy9pLvr0zSzpI8_xTaM6KulO2mwYztbQ
 *     responses:
 *       "200":
 *         description: The new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       "400":
 *         description: Invalid request or refresh token is not present
 *       "401":
 *         description: Invalid or expired token or refresh token was already used
 */

router.post('/refresh', refreshMiddleware, refresh);

/**
 * @swagger
 * /api/v1/auth/me:
 *   post:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: The user profile
 *       "401":
 *         description: Unauthorized
 */
router.post('/me', protect, getMe);

export default router;
