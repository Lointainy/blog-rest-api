const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const {
	getUserProfile,
	getUserProfileById,
	updateUserProfile,
	deleteUserProfile,
	getUsers,
	newPassword,
	resetPassword,
	resetPasswordConfirm,
	newEmail
} = require('../controllers/userConroller');

const router = express.Router();

router.get('/profile', [authMiddleware], getUserProfile);
router.get('/profile/:id', getUserProfileById);
router.put('/profile', [authMiddleware], updateUserProfile);
router.put('/new-password', [authMiddleware], newPassword);
router.put('/new-email', [authMiddleware], newEmail);
router.post('/reset-password', resetPassword);
router.post('/reset-password-confirm', resetPasswordConfirm);
router.delete('/profile', [authMiddleware], deleteUserProfile);
router.get('/', [authMiddleware, roleMiddleware], getUsers);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile.
 *     description: Retrieve the profile of the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /user/profile/{id}:
 *   get:
 *     summary: Get user profile by ID.
 *     description: Retrieve the profile of a user by their ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       '404: User Not Found':
 *         description: Bad request - User with token email does not exist.
 *       '405':
 *         description: Bad request - Invalid user data.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile.
 *     description: Update the profile of the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       '200':
 *         description: User profile updated successfully.
 *       '405':
 *         description: Bad request - Invalid user data.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /user/profile:
 *   delete:
 *     summary: Delete user profile.
 *     description: Delete the profile of the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile deleted successfully.
 *       '404: User Not Found':
 *         description: Bad request - User with token email does not exist.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users.
 *     description: Retrieve all users (admin access required).
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/user'
 *       '404: Users Not Found':
 *         description: Bad request - User with token email does not exist.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /user/new-password:
 *   put:
 *     summary: Change user password.
 *     description: Change the password of the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *             example:
 *               password: "@Dm1n"
 *               newPassword: "P@ssw0rd"
 *             required:
 *               - password
 *               - newPassword
 *     responses:
 *       '200':
 *         description: Password changed successfully.
 *       '400: Password no Match':
 *         description: Bad request - User password is not Match.
 *       '400: Password Match':
 *         description: Bad request - New password is match password.
 *       '404: User Not Found':
 *         description: Bad request - User with token email does not exist.
 *       '405':
 *         description: Bad request - Invalid user data.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /user/new-email:
 *   put:
 *     summary: Change user email.
 *     description: Change the email of the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Current email of the user.
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 description: New email of the user.
 *             example:
 *               email: "admin@mail.com"
 *               newEmail: "newemail@example.com"
 *             required:
 *               - email
 *               - newEmail
 *     responses:
 *       '200':
 *         description: Email changed successfully.
 *       '400: Email no Match':
 *         description: Bad request - User email is not Match.
 *       '400: Email Used':
 *         description: Bad request - New Email is already used.
 *       '405':
 *         description: Bad request - Invalid user data.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     summary: Request password reset.
 *     description: Request a password reset by providing the email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email to request password reset.
 *             example:
 *               email: "admin@mail.com"
 *             required:
 *               - email
 *     responses:
 *       '201':
 *         description: Reset password request initiated.
 *       '404: User Not Found':
 *         description: Bad request - User with email does not exist.
 *       '405':
 *         description: Bad request - Invalid user data.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /user/reset-password-confirm:
 *   post:
 *     summary: Confirm password reset.
 *     description: Confirm a password reset with the provided token and new password.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token received via email.
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: New password to set for the user.
 *             example:
 *               token: "3ab7efd3-8b46-4cee-827c-b154a4c8f19d"
 *               newPassword: "@Dm1n"
 *             required:
 *               - token
 *               - newPassword
 *     responses:
 *       '200':
 *         description: Password reset confirmed.
 *       '400: Token is not Exists':
 *         description: Bad request - User with email does not exist.
 *       '404: User Not Found':
 *         description: Bad request - User does not exist.
 *       '405':
 *         description: Bad request - Invalid user data.
 *       '500':
 *         description: Server error.
 */

module.exports = router;

