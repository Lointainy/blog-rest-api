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

const getLikeCountByUserId = async (authorId) => {
	try {
		const count = await db.like.count({
			where: {
				authorId
			}
		});
		return count;
	} catch {
		return null;
	}
};

module.exports = { getLikeById, getLikeCountByUserId };

