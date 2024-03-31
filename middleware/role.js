const roleMiddleware = async (req, res, next) => {
	const { role } = req.user;

	try {
		if (role !== 'ADMIN') {
			return res.status(401).json({ error: 'errorUserIsNotAdmin' });
		}

		next();
	} catch (error) {
		return res.status(401).json({ error: 'errorRole' });
	}
};

module.exports = roleMiddleware;

