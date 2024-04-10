const z = require('zod');
const db = require('../prisma');

const { commentValidation } = require('../schemas');
const { getCommentById } = require('../data/comment');
const { getPostById } = require('../data/post');

const getCommentManyByPostId = async (req, res) => {
	const { postId } = req.params;

	const existingPost = await getPostById(postId);

	if (!existingPost) {
		return res.status(404).json({ error: 'errorPostIsNotExist' });
	}

	try {
		const comments = await db.comment.findMany({
			where: {
				postId
			}
		});

		if (!comments || !comments.length) {
			return res.status(404).json({ message: 'errorCommentIsNotExist' });
		}

		return res.status(200).json({ message: 'successCommets', comments });
	} catch (error) {
		return res.status(500).json({ error: 'errorComments' });
	}
};

const createComment = async (req, res) => {
	const { postId } = req.params;
	const newComment = req.body;
	const user = req.user;

	if (!newComment) {
		return res.status(405).json({ error: 'errorEmptyPost' });
	}

	const existingPost = await getPostById(postId);

	if (!existingPost) {
		return res.status(404).json({ error: 'errorPostIsNotExist' });
	}

	try {
		const validateData = commentValidation.commentSchema.parse(newComment);

		const newCreatedComment = await db.comment.create({
			data: {
				...newComment,
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
				commentsCount: {
					increment: 1
				}
			}
		});

		await db.user.update({
			where: {
				id: user.id
			},
			data: {
				commentsCount: {
					increment: 1
				}
			}
		});

		return res.status(201).json({ comment: newCreatedComment, success: 'successCommentCreated' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(405).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorCommentCreate' });
	}
};

const deleteComment = async (req, res) => {
	const { id } = req.params;
	const user = req.user;

	const existingComment = await getCommentById(id);

	if (!existingComment) {
		return res.status(404).json({ error: 'errorCommentIsNotExist' });
	}

	try {
		const deletedComment = await db.comment.delete({
			where: {
				id
			}
		});

		await db.post.update({
			where: {
				id: existingComment.postId
			},
			data: {
				commentsCount: {
					decrement: 1
				}
			}
		});

		if (!deleteComment) {
			return res.status(404).json({ error: 'errorCommentIsNotExist' });
		}

		return res.status(200).json({ message: 'successCommentDeleted' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'errorCommentDelete' });
	}
};

const deleteCommentMany = async (req, res) => {
	const { postId } = req.params;

	const existingPost = await getPostById(postId);

	if (!existingPost) {
		return res.status(404).json({ error: 'errorPostIsNotExist' });
	}

	if (!existingPost.comments) {
		return res.status(404).json({ error: 'errorPostHasNoComments' });
	}

	try {
		await db.comment.deleteMany({
			where: {
				postId
			}
		});

		return res.status(200).json({ success: 'successCommentsDeleted' });
	} catch (error) {
		return res.status(500).json({ error: 'errorCommentsDelete' });
	}
};

module.exports = { createComment, deleteComment, deleteCommentMany, getCommentManyByPostId };

