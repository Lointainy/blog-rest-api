const db = require('../prisma');
const { v4: uuidv4 } = require('uuid');
const { getVerificationTokenByEmail } = require('../data/verification-token');

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

module.exports = { generateVerificationToken };

