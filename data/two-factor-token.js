const db = require('../prisma');

const getTwoFactorTokenByToken = async (token) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findUnique({
			where: { token }
		});

		return twoFactorToken;
	} catch {
		return null;
	}
};

const getTwoFactorTokenByEmail = async (email) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findFirst({
			where: { email }
		});

		return twoFactorToken;
	} catch {
		return null;
	}
};

const getTwoFactorConfirmationByUserId = async (userId) => {
	try {
		const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
			where: { userId }
		});

		return twoFactorConfirmation;
	} catch {
		return null;
	}
};

module.exports = { getTwoFactorTokenByEmail, getTwoFactorTokenByToken, getTwoFactorConfirmationByUserId };

