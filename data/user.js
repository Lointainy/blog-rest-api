const db = require('../prisma');

const getUserByEmail = async (email) => {
	try {
		const user = await db.user.findUnique({
			where: {
				email
			}
		});

		return user;
	} catch {
		return null;
	}
};

const getUserById = async (id) => {
	try {
		const user = await db.user.findUnique({
			where: {
				id
			}
		});
		return user;
	} catch {
		return null;
	}
};

module.exports = { getUserByEmail, getUserById };

