const { getUserByEmail } = require('../data/user');
const { getVerificationTokenByToken } = require('../data/verification-token');
const { generateVerificationToken } = require('../lib/tokens');
const db = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { v4: uuidv4 } = require('uuid');

const genereteAccessToken = (id) => {
	const payload = {
		id
	};
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const existingUser = await getUserByEmail(email);

		if (!existingUser || !existingUser.email || !existingUser.password) {
			return res.status(400).json({ error: 'Email does not exist!' });
		}

		const passwordsMatch = await bcrypt.compare(password, existingUser.password);

		if (!passwordsMatch) {
			return res.status(400).json({ error: 'Password is not match ' });
		}

		const token = genereteAccessToken(existingUser.id);

		delete existingUser.password;

		return res.status(201).json({ token, success: true, message: 'User is login', user: existingUser });
	} catch (error) {
		return res.status(500).json({ success: false, error: 'Problem with register' });
	}
};

const register = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			return res.status(400).json({ success: false, error: 'User is exist' });
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
			.json({ verificationToken: verificationToken.token, success: true, message: 'User is registered', user: newUser });
	} catch (error) {
		return res.status(500).json({ success: false, error: 'Problem with register' });
	}
};

const verifyEmail = async (req, res) => {
	const { token } = req.body;

	try {
		const existingToken = await getVerificationTokenByToken(token);

		if (!existingToken) {
			return res.status(400).json({ success: false, error: 'Token is not exist' });
		}

		const hasExpired = new Date(existingToken.expires) < new Date();

		if (hasExpired) {
			return res.status(400).json({ success: false, error: 'Token has expired' });
		}

		const existingUser = await getUserByEmail(existingToken.email);

		if (!existingUser) {
			return res.status(400).json({ success: false, error: 'User is exist' });
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

		return res.status(200).json({ success: true, message: 'Email verified' });
	} catch (error) {
		return res.status(500).json({ success: false, error: 'Problem with verification' });
	}
};

module.exports = { login, register, verifyEmail };

