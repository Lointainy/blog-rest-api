const db = require('../prisma');

const getVerificationTokenByToken = async (token) => {
	try {
		const verificationToken = await db.verificationToken.findUnique({
			where: { token }
		});

		return verificationToken;
	} catch {
		return null;
	}
};

const getVerificationTokenByEmail = async (email) => {
	try {
		const verificationToken = await db.verificationToken.findFirst({
			where: { email }
		});

		return verificationToken;
	} catch {
		return null;
	}
};

module.exports = { getVerificationTokenByEmail, getVerificationTokenByToken };

