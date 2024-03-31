const { getUserByEmail } = require('../data/user');
const db = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

		const newUser = await db.user.create({
			data: {
				name,
				email,
				password: hashedPassword
			},
			select: {
				id: true,
				name: true,
				email: true
			}
		});

		const token = genereteAccessToken(newUser.id);

		return res.status(201).json({ token, success: true, message: 'User is registered', user: newUser });
	} catch (error) {
		return res.status(500).json({ success: false, error: 'Problem with register' });
	}
};

module.exports = { login, register };

