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

			await db.post.update({
				where: {
					id: postId
				},
				data: {
					likesCount: {
						decrement: 1
					}
				}
			});

			await db.user.update({
				where: {
					id: user.id
				},
				data: {
					likesCount: {
						decrement: 1
					}
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

		await db.post.update({
			where: {
				id: postId
			},
			data: {
				likesCount: {
					increment: 1
				}
			}
		});

		await db.user.update({
			where: {
				id: user.id
			},
			data: {
				likesCount: {
					increment: 1
				}
			}
		});

		return res.status(201).json({ like: newLike, success: 'successLikeAdded' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'errorLike' });
	}
};

const getLikeMany = async (req, res) => {
	const { postId, authorId } = req.query;

	if (postId) {
		const existingPost = await getPostById(postId);

		if (!existingPost) {
			return res.status(400).json({ error: 'errorPostIsNotExist' });
		}
	}

	try {
		const likes = await db.like.findMany({
			where: {
				postId,
				authorId
			}
		});

		if (!likes || !likes.length) {
			return res.status(400).json({ message: 'errorLikeIsNotExist' });
		}

		return res.status(200).json({ message: 'successLikes', likes });
	} catch (error) {
		return res.status(500).json({ error: 'errorLikes' });
	}
};

module.exports = { like, getLikeMany };

