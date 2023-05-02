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

/**
 * @swagger
 * /api/v1/account/transfer:
 *   post:
 *     tags:
 *       - Transfer
 *     summary: Transfer funds between accounts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromAccountId:
 *                 type: string
 *                 description: The ID of the account to transfer funds from.
 *                 example: "123456"
 *               toAccountId:
 *                 type: string
 *                 description: The ID of the account to transfer funds to.
 *                 example: "789012"
 *               amount:
 *                 type: number
 *                 description: The amount of funds to transfer.
 *                 example: 1000.00
 *               tag:
 *                 type: string
 *                 description: The tag associated with the transfer.
 *                 example: "Rent payment"
 *     responses:
 *       '200':
 *         description: Successful transfer of funds
 *       '400':
 *         description: Invalid request parameters
 *       '401':
 *         description: Unauthorized request
 */

router.post('/transfer', protect, transferFund);

export default router;
