const db = require('../prisma');
const bcrypt = require('bcryptjs');
const z = require('zod');

const { getUserById, getUserByEmail } = require('../data/user');
const { generateResetPasswordToken } = require('../lib/tokens');
const { getResetPasswordTokenByToken } = require('../data/password-reset-token');
const { userValidation, authValidation } = require('../schemas');
const { getCommentCountByUserId } = require('../data/comment');
const { getPostCountByUserId } = require('../data/post');
const { getLikeCountByUserId } = require('../data/like');

const checkCounts = async (userId) => {
	if (!userId) {
		return null;
	}

	const postsCount = await getPostCountByUserId(userId);

	const commentsCount = await getCommentCountByUserId(userId);

	const likesCount = await getLikeCountByUserId(userId);

	return { postsCount, likesCount, commentsCount };
};

const getUserProfile = async (req, res) => {
	const user = req.user;

	try {
		const counts = await checkCounts(user.id);

		const userProfileDetails = await db.user.update({
			where: {
				id: user.id
			},
			data: {
				...counts
			}
		});

		delete userProfileDetails.password;

		return res.status(200).json({
			success: 'successUserProfile',
			user: { ...userProfileDetails }
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'errorUser' });
	}
};

const getUserProfileById = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(405).json({ error: 'errorEmptyField' });
	}

	try {
		const existingUser = await db.user.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				name: true,
				image: true
			}
		});

		if (!existingUser) {
			return res.status(404).json({ error: 'errorUserIsNotExist' });
		}

		return res.status(200).json({ success: 'successUserProfile', user: existingUser });
	} catch (error) {
		return res.status(500).json({ error: 'errorUser' });
	}
};

const updateUserProfile = async (req, res) => {
	const user = req.user;
	let updatedUser = req.body;

	if (!updatedUser) {
		return res.status(405).json({ error: 'errorEmptyFields' });
	}

	try {
		const validatedData = await userValidation.userSchema.partial().strict().parseAsync(updatedUser);

		await db.user.update({
			where: {
				id: user.id
			},
			data: {
				...validatedData
			}
		});

		return res.status(200).json({ success: 'successUserUpdated' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(405).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorUpdateUser' });
	}
};

const deleteUserProfile = async (req, res) => {
	const id = req.user.id;
	try {
		const deletedUser = await db.user.delete({
			where: { id }
		});

		if (!deletedUser) {
			return res.status(404).json({ error: 'errorUserIsNotExist' });
		}

		return res.status(200).json({ message: 'successUserDeleted' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'errorDeleteUser' });
	}
};

const getUsers = async (req, res) => {
	try {
		const users = await db.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				role: true
			}
		});

		if (!users || !users.length) {
			return res.status(404).json({ error: 'errorNoUsersFound' });
		}

		return res.status(200).json({ success: 'successUsers', users });
	} catch (error) {
		return res.status(500).json({ error: 'errorUsers' });
	}
};

const newPassword = async (req, res) => {
	const id = req.user.id;
	const { password, newPassword } = req.body;

	if (!password || !newPassword) {
		return res.status(405).json({ error: 'errorEmptyField' });
	}

	const existingUser = await getUserById(id);

	if (!existingUser) {
		return res.status(404).json({ error: 'errorUserIsNotExist' });
	}

	try {
		const validateData = userValidation.newPasswordSchema.parse({ password, newPassword });

		if (password && newPassword && existingUser.password) {
			if (password === newPassword) {
				return res.status(400).json({ error: 'errorPasswordMatch' });
			}

			const passwordMatch = await bcrypt.compare(password, existingUser.password);

			if (!passwordMatch) {
				return res.status(400).json({ error: 'errorPasswordIsNotMatch' });
			}

			const hashedPassword = await bcrypt.hash(newPassword, 10);

			await db.user.update({
				where: {
					id: existingUser.id
				},
				data: {
					password: hashedPassword
				}
			});

			return res.status(200).json({ success: 'Password is updated' });
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(405).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorNewPassword' });
	}
};

const resetPassword = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(405).json({ error: 'errorEmptyField' });
	}

	try {
		const validateData = authValidation.emailSchema.parse(email);

		const existingUser = getUserByEmail(email);

		if (!existingUser) {
			return res.status(404).json({ error: 'errorUserIsNotExist' });
		}

		const resetPasswordToken = await generateResetPasswordToken(email);

		return res.status(201).json({ resetPasswordToken: resetPasswordToken.token, success: 'successResetPasswordTokenIsCreated' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(405).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorResetPassword' });
	}
};

const resetPasswordConfirm = async (req, res) => {
	const { token, newPassword } = req.body;

	if (!token || !newPassword) {
		return res.status(405).json({ error: 'errorEmptyField' });
	}

	try {
		const validateData = userValidation.resetPasswordConfirmSchema.parse({ token, newPassword });

		const existingToken = await getResetPasswordTokenByToken(token);

		if (!existingToken) {
			return res.status(400).json({ error: 'errorTokenIsNotExist' });
		}

		const hasExpired = new Date(existingToken.expires) < new Date();

		const existingUser = await getUserByEmail(existingToken.email);

		if (!existingUser) {
			return res.status(404).json({ error: 'errorUserIsExist' });
		}

		await db.resetPasswordToken.delete({
			where: { id: existingToken.id }
		});

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await db.user.update({
			where: { id: existingUser.id },
			data: {
				password: hashedPassword
			}
		});

		return res.status(200).json({ success: 'successNewPasswordUpdated' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(405).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorResetPassword' });
	}
};

const newEmail = async (req, res) => {
	const user = req.user;
	const { email, newEmail } = req.body;

	if (!email || !newEmail) {
		return res.status(405).json({ error: 'errorEmptyField' });
	}

	try {
		const validateData = userValidation.newEmailSchema.parse({ email, newEmail });

		if (user.email !== email) {
			return res.status(400).json({ error: 'errorEmailIsNotMatch' });
		}

		const existingUser = await getUserByEmail(newEmail);

		if (existingUser && existingUser.email === newEmail) {
			return res.status(400).json({ error: 'errorEmailIsAlredyUsed' });
		}

		if (email && newEmail) {
			await db.user.update({
				where: {
					id: user.id
				},
				data: {
					email: newEmail,
					emailVerified: new Date()
				}
			});

			return res.status(200).json({ success: 'successNewEmail' });
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(405).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorNewEmail' });
	}
};

module.exports = {
	getUserProfile,
	getUserProfileById,
	updateUserProfile,
	deleteUserProfile,
	getUsers,
	newPassword,
	newEmail,
	resetPassword,
	resetPasswordConfirm
};

