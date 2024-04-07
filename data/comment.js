const db = require('../prisma');

const getCommentById = async (id) => {
	try {
		const comment = await db.comment.findUnique({
			where: {
				id
			}
		});
		return comment;
	} catch {
		return null;
	}
};

const getCommentCountByUserId = async (authorId) => {
	try {
		const count = await db.comment.count({
			where: {
				authorId
			}
		});
		return count;
	} catch {
		return null;
	}
};

module.exports = { getCommentById, getCommentCountByUserId };

