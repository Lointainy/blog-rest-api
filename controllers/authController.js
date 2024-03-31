const db = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const { getUserByEmail } = require('../data/user');
const { getVerificationTokenByToken } = require('../data/verification-token');
const { generateVerificationToken, generateTwoFactorToken } = require('../lib/tokens');
const { getTwoFactorTokenByEmail, getTwoFactorConfirmationByUserId } = require('../data/two-factor-token');

/*
	DOC:

	ERROR type
		errorEmailNotExist
		errorPasswordIsNotMatch
		errorInvalidCode
		errorExpiredCode
		errorUserIsExist
		errorLogin
		errorRegister
		errorTokenIsNotExist
		errorExpiredToken
		errorEmailVerification

	SUCCESS type
		successTokenCreated
		successUserLogin
		successUserRegister
		successEmailVerified
*/

const genereteAccessToken = (id) => {
	const payload = {
		id
	};
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const login = async (req, res) => {
	const { email, password, code } = req.body;

	try {
		const existingUser = await getUserByEmail(email);

		if (!existingUser || !existingUser.email || !existingUser.password) {
			return res.status(400).json({ error: 'errorEmailNotExist' });
		}

		const passwordsMatch = await bcrypt.compare(password, existingUser.password);

		if (!passwordsMatch) {
			return res.status(400).json({ error: 'errorPasswordIsNotMatch' });
		}

		if (existingUser.isTwoFactorEnabled && existingUser.email) {
			if (code) {
				const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

				if (!twoFactorToken) {
					return res.status(400).json({ error: 'errorInvalidCode' });
				}

				if (twoFactorToken.token !== code) {
					return res.status(400).json({ error: 'errorInvalidCode' });
				}

				const hasExpired = new Date(twoFactorToken.expires) < new Date();

				if (hasExpired) {
					return res.status(400).json({ error: 'errorExpiredCode' });
				}

				await db.twoFactorToken.delete({
					where: { id: twoFactorToken.id }
				});

				const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

				if (existingConfirmation) {
					await db.twoFactorConfirmation.delete({
						where: { id: existingConfirmation.id }
					});
				}

				await db.twoFactorConfirmation.create({
					data: {
						userId: existingUser.id
					}
				});
			} else {
				const twoFactorToken = await generateTwoFactorToken(existingUser.email);

				return res.status(200).json({ twoFactorToken: twoFactorToken.token, twoFactor: true, message: 'successTokenCreated' });
			}
		}

		const token = genereteAccessToken(existingUser.id);

		delete existingUser.password;

		return res.status(201).json({ token, success: true, message: 'successUserLogin', user: existingUser });
	} catch (error) {
		return res.status(500).json({ success: false, error: 'errorLogin' });
	}
};

const register = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			return res.status(400).json({ success: false, error: 'errorUserIsExist' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const verificationToken = await generateVerificationToken(email);

		const newUser = await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword
			},
			select: {
				name: true,
				email: true
			}
		});

		return res
			.status(201)
			.json({ verificationToken: verificationToken.token, success: true, message: 'successUserRegister', user: newUser });
	} catch (error) {
		return res.status(500).json({ success: false, error: 'errorRegister' });
	}
};

const verifyEmail = async (req, res) => {
	const { token } = req.body;

	try {
		const existingToken = await getVerificationTokenByToken(token);

		if (!existingToken) {
			return res.status(400).json({ success: false, error: 'errorTokenIsNotExist' });
		}

		const hasExpired = new Date(existingToken.expires) < new Date();

		if (hasExpired) {
			return res.status(400).json({ success: false, error: 'errorExpiredToken' });
		}

		const existingUser = await getUserByEmail(existingToken.email);

		if (!existingUser) {
			return res.status(400).json({ success: false, error: 'errorUserIsExist' });
		}

		await db.user.update({
			where: { id: existingUser.id },
			data: {
				emailVerified: new Date(),
				email: existingToken.email
			}
		});

		await db.verificationToken.delete({
			where: { id: existingToken.id }
		});

		return res.status(200).json({ success: true, message: 'successEmailVerified' });
	} catch (error) {
		return res.status(500).json({ success: false, error: 'errorEmailVerification' });
	}
};

module.exports = { login, register, verifyEmail };

