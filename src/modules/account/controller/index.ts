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
import { transferFund } from '../service';
import { protect } from '../../../middleware';
const router = express.Router();

router.post('/transfer', protect, transferFund);

export default router;
