const db = require('../prisma');

const { getPostById } = require('../data/post');
const { getLikeById } = require('../data/like');

const like = async (req, res) => {
	const user = req.user;
	const { postId } = req.params;

	const existingPost = await getPostById(postId);

	if (!existingPost) {
		return res.status(400).json({ error: 'errorPostIsNotExist' });
	}

	try {
		const existingLike = await db.like.findFirst({
			where: {
				postId,
				authorId: user.id
			}
		});

		if (existingLike) {
			const deletedLike = await db.like.delete({
				where: {
					id: existingLike.id
				}
			});

			return res.status(201).json({ success: 'successLikeRemoved' });
		}

		const newLike = await db.like.create({
			data: {
				postId,
				authorId: user.id,
				authorName: user.name
			}
		});

		return res.status(201).json({ like: newLike, success: 'successLikeAdded' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'errorLike' });
	}
};

module.exports = { like };

