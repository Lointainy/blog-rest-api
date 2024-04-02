const db = require('../prisma');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { getVerificationTokenByEmail } = require('../data/verification-token');
const { getTwoFactorTokenByEmail } = require('../data/two-factor-token');
const { getResetPasswordTokenByEmail } = require('../data/password-reset-token');

const generateResetPasswordToken = async (email) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 15 * 60 * 1000);
	const existingToken = await getResetPasswordTokenByEmail(email);

	if (existingToken) {
		await db.resetPasswordToken.delete({
			where: { id: existingToken.id }
		});
	}
	const resetPasswordToken = await db.resetPasswordToken.create({
		data: {
			email,
			token,
			expires
		}
	});

	return resetPasswordToken;
};

const generateTwoFactorToken = async (email) => {
	const token = crypto.randomInt(100_000, 1_000_000).toString();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getTwoFactorTokenByEmail(email);

	if (existingToken) {
		await db.twoFactorToken.delete({
			where: { id: existingToken.id }
		});
	}

	const twoFactorToken = await db.twoFactorToken.create({
		data: {
			email,
			token,
			expires
		}
	});

	return twoFactorToken;
};

const generateVerificationToken = async (email) => {
	const token = uuidv4();
	const expires = new Date(new Date().getTime() + 3600 * 1000);

	const existingToken = await getVerificationTokenByEmail(email);

	if (existingToken) {
		await db.verificationToken.delete({
			where: {
				id: existingToken.id
			}
		});
	}

	const verificationToken = await db.verificationToken.create({
		data: {
			email,
			token,
			expires
		}
	});

	return verificationToken;
};

module.exports = { generateVerificationToken, generateTwoFactorToken, generateResetPasswordToken };

