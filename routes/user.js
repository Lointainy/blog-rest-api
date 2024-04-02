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
router.put('/profile', authMiddleware, updateUserProfile);
router.put('/new-password', authMiddleware, newPassword);
router.put('/new-email', authMiddleware, newEmail);
router.post('/reset-password', resetPassword);
router.post('/reset-password-confirm', resetPasswordConfirm);
router.delete('/profile', authMiddleware, deleteUserProfile);
router.get('/', [authMiddleware, roleMiddleware], getUsers);

module.exports = router;

