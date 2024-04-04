const db = require('../prisma');

const getLikeById = async (id) => {
	try {
		const like = await db.like.findUnique({
			where: {
				id
			}
		});
		return like;
	} catch {
		return null;
	}
};

module.exports = { getLikeById };

