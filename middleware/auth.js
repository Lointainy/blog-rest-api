const jwt = require('jsonwebtoken');
const { getUserById } = require('../data/user');

const authMiddleware = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({ error: 'errorAuthToken' });
	}

	const token = authorization.split(' ')[1];

	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET);

		req.user = await getUserById(id);

		if (!req.user) {
			return res.status(400).json({ error: 'errorUserNotFound' });
		}

		next();
	} catch (error) {
		return res.status(401).json({ error: 'errorAuth' });
	}
};

module.exports = authMiddleware;

