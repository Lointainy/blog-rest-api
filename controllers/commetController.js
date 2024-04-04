const z = require('zod');
const db = require('../prisma');

const { getPostById } = require('../data/post');
const { commentValidation } = require('../schemas');
const { getCommentById } = require('../data/comment');

const createComment = async (req, res) => {
	const { postId } = req.params;
	const newComment = req.body;
	const user = req.user;

	if (!newComment) {
		return res.status(400).json({ error: 'errorEmptyPost' });
	}

	const existingPost = await getPostById(postId);

	if (!existingPost) {
		return res.status(400).json({ error: 'errorPostIsNotExist' });
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

		return res.status(201).json({ comment: newCreatedComment, success: 'successCommentCreated' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorCommentCreate' });
	}
};

const deleteComment = async (req, res) => {
	const { id } = req.params;

	const existingComment = await getCommentById(id);

	if (!existingComment) {
		return res.status(400).json({ error: 'errorCommentIsNotExist' });
	}

	try {
		const deletedComment = await db.comment.delete({
			where: {
				id
			}
		});

		if (!deleteComment) {
			return res.status(400).json({ error: 'errorCommentIsNotExist' });
		}

		return res.status(200).json({ message: 'successCommentDeleted' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'errorCommentDelete' });
	}
};

const deleteComments = async (req, res) => {
	const { postId } = req.params;

	const existingPost = await getPostById(postId);

	if (!existingPost) {
		return res.status(400).json({ error: 'errorPostIsNotExist' });
	}

	if (!existingPost.comments) {
		console.log(existingPost);

		return res.status(400).json({ error: 'errorPostHasNoComments' });
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

module.exports = { createComment, deleteComment, deleteComments };

