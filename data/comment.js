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

module.exports = { getCommentById };

