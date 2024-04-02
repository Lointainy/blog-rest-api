const db = require('../prisma');

const getResetPasswordTokenByToken = async (token) => {
	try {
		const resetPasswordToken = await db.resetPasswordToken.findUnique({
			where: { token }
		});

		return resetPasswordToken;
	} catch {
		return null;
	}
};

const getResetPasswordTokenByEmail = async (email) => {
	try {
		const resetPasswordToken = await db.resetPasswordToken.findFirst({
			where: { email }
		});

		return resetPasswordToken;
	} catch {
		return null;
	}
};

module.exports = {
	getResetPasswordTokenByEmail,
	getResetPasswordTokenByToken
};

