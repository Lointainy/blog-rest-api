const db = require('../prisma');
const bcrypt = require('bcryptjs');
const z = require('zod');

const { getUserById, getUserByEmail } = require('../data/user');
const { generateVerificationToken, generateResetPasswordToken } = require('../lib/tokens');
const { getResetPasswordTokenByToken } = require('../data/password-reset-token');
const { newPasswordSchema, emailSchema, resetPasswordConfirmSchema, newEmailSchema } = require('../schemas');

const getUserProfile = async (req, res) => {
	const user = req.user;

	try {
		delete user.password;

		return res.status(200).json({ success: 'successUserProfile', user });
	} catch (error) {
		return res.status(500).json({ error: 'errorUser' });
	}

	return res.status(200).json({ user });
};

const getUserProfileById = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: 'errorEmptyField' });
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
			return res.status(400).json({ error: 'errorUserIsNotExist' });
		}

		return res.status(200).json({ success: 'successUserProfile', user: existingUser });
	} catch (error) {
		return res.status(500).json({ error: 'errorUser' });
	}
};

const updateUserProfile = async (req, res) => {
	const user = req.user;
	let values = req.body;

	try {
		const existingUser = await getUserByEmail(user.email);

		if (values.email && values.email !== user.email) {
			if (existingUser && existingUser.id !== user.id) {
				return res.status(400).json({ error: 'errorEmailIsAlredyUsed' });
			}

			const verificationToken = await generateVerificationToken(values.email);

			return res.status(200).json({ verificationToken: verificationToken.token, success: 'successEmailVerificationTokenCreated' });
		}

		if (values.password && values.newPassword && existingUser.password) {
			const passwordMatch = await bcrypt.compare(values.password, existingUser.password);

			if (!passwordMatch) {
				return res.status(400).json({ error: 'errorPasswordIsNotMatch' });
			}

			const hashedPassword = await bcrypt.hash(values.newPassword, 10);
			values.password = hashedPassword;
			delete values.newPassword;
		}

		await db.user.update({
			where: {
				id: existingUser.id
			},
			data: {
				...values
			}
		});

		return res.status(200).json({ success: 'successUserUpdated' });
	} catch (error) {
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
			return res.status(400).json({ error: 'errorUserIsNotExist' });
		}

		return res.status(200).json({ message: 'successUserDeleted' });
	} catch (error) {
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
		return res.status(400).json({ error: 'errorEmptyField' });
	}

	const existingUser = await getUserById(id);

	if (!existingUser) {
		return res.status(400).json({ error: 'errorUserIsNotExist' });
	}

	if (!password || !newPassword) {
		return res.status(400).json({ error: 'errorEmptyField' });
	}

	try {
		const validateData = newPasswordSchema.parse({ password, newPassword });

		if (password && newPassword && existingUser.password) {
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
			return res.status(400).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorNewPassword' });
	}
};

const resetPassword = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ error: 'errorEmptyField' });
	}

	try {
		const validateData = emailSchema.parse(email);

		const existingUser = getUserByEmail(email);

		if (!existingUser) {
			return res.status(400).json({ error: 'errorUserIsNotExist' });
		}

		const resetPasswordToken = await generateResetPasswordToken(email);

		return res.status(201).json({ resetPasswordToken: resetPasswordToken.token, success: 'successResetPasswordTokenIsCreated' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorResetPassword' });
	}
};

const resetPasswordConfirm = async (req, res) => {
	const { token, newPassword } = req.body;

	if (!token || !newPassword) {
		return res.status(400).json({ error: 'errorEmptyField' });
	}

	try {
		const validateData = resetPasswordConfirmSchema.parse({ token, newPassword });

		const existingToken = await getResetPasswordTokenByToken(token);

		if (!existingToken) {
			return res.status(400).json({ error: 'errorTokenIsNotExist' });
		}

		const hasExpired = new Date(existingToken.expires) < new Date();

		const existingUser = await getUserByEmail(existingToken.email);

		if (!existingUser) {
			return res.status(400).json({ error: 'errorUserIsExist' });
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
			return res.status(400).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorResetPassword' });
	}
};

const newEmail = async (req, res) => {
	const user = req.user;
	const { email, newEmail } = req.body;

	if (!email || !newEmail) {
		return res.status(400).json({ error: 'errorEmptyField' });
	}

	try {
		const validateData = newEmailSchema.parse({ email, newEmail });

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
			return res.status(400).json({ error: 'errorInvalidData', details: error.errors });
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

