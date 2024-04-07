const db = require('../prisma');

const getPostById = async (id) => {
	try {
		const post = await db.post.findUnique({
			where: {
				id
			}
		});
		return post;
	} catch {
		return null;
	}
};

const getPostCountByUserId = async (authorId) => {
	try {
		const count = await db.post.count({
			where: {
				authorId
			}
		});
		return count;
	} catch {
		return null;
	}
};

module.exports = { getPostById, getPostCountByUserId };

