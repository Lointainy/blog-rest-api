const express = require('express');

const router = express.Router();

const { login, register, verifyEmail } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/new-email-verification', verifyEmail);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user.
 *     description: Endpoint to log in a user.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              $ref: '#/components/schemas/login'
 *     responses:
 *       '200':
 *         description: User logged in successfully.
 *       '201':
 *         description: Token 2fa created.
 *       '405':
 *         description: Bad request - Invalid email, password, or code.
 *       '400: Email':
 *         description: Bad request - Email does not exist.
 *       '400: Password':
 *         description: Bad request - Password does not match.
 *       '400: Code Invalid':
 *         description: Bad request - Invalid two-factor authentication code.
 *       '400: Code Expired':
 *         description: Bad request - Two-factor authentication code has expired.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user.
 *     description: Endpoint to register a new user.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *              $ref: '#/components/schemas/register'
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *       '400':
 *         description: Bad request - Missing required fields or user already exists.
 *       '400: User Exists':
 *         description: Bad request - User already exists.
 *       '405: Invalid Data':
 *         description: Bad request - Invalid data provided.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email.
 *     description: Endpoint to verify user's email with a verification token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: 36631857-d71f-4282-a0b8-16482e14b4a6
 *                 description: Verification token received via email.
 *     responses:
 *       '200':
 *         description: Email verified successfully.
 *       '405':
 *         description: Bad request - Empty token or token does not exist.
 *       '400: Token Expired':
 *         description: Bad request - Verification token has expired.
 *       '404: User Not Found':
 *         description: Bad request - User with token email does not exist.
 *       '500':
 *         description: Server error.
 */

module.exports = router;

