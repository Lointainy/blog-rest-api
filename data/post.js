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

module.exports = { getPostById };

