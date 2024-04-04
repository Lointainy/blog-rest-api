const db = require('../prisma');

const getPostById = async (id) => {
	try {
		const post = await db.post.findUnique({
			where: {
				id
			},
			include: { comments: true, likes: true }
		});
		return post;
	} catch {
		return null;
	}
};

module.exports = { getPostById };

