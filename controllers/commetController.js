const z = require('zod');
const db = require('../prisma');

const { commentValidation } = require('../schemas');
const { getCommentById } = require('../data/comment');
const { getPostById } = require('../data/post');

const createComment = async (req, res) => {
	const { postId } = req.params;
	const newComment = req.body;
	const user = req.user;

	const existingPost = await getPostById(postId);

	if (!existingPost) {
		return res.status(404).json({ error: 'errorPostIsNotExist' });
	}

	if (!newComment || !Object.keys(newComment).length) {
		return res.status(405).json({ error: 'errorEmptyPost' });
	}

	try {
		const validatedData = await commentValidation.commentSchema.partial().strict().parseAsync(newComment);

		const newCreatedComment = await db.comment.create({
			data: {
				...validatedData,
				postId,
				authorId: user.id,
				authorName: user.name
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

const updateCommentById = async (req, res) => {
	const { commentId } = req.params;
	const updatedComment = req.body;

	const existingComment = await getCommentById(commentId);

	if (!existingComment) {
		return res.status(404).json({ error: 'errorCommentIsNotExist' });
	}

	let currentTime = new Date();

	currentTime.setMinutes(currentTime.getMinutes() - 10); // 24 hours

	const commentCreatedAt = new Date(existingComment.createdAt);

	if (commentCreatedAt.getTime() < currentTime.getTime()) {
		return res.status(400).json({ error: 'errorCommentUpdateExpiredTime' });
	}

	try {
		const validatedData = await commentValidation.commentSchema.partial().strict().parseAsync(updatedComment);

		const newCreatedComment = await db.comment.update({
			where: {
				id: commentId
			},
			data: {
				...validatedData
			}
		});

		return res.status(201).json({ success: 'successCommentUpdated' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(405).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorCommentUpdate' });
	}
};

const getCommentMany = async (req, res) => {
	const { authorId, postId } = req.query;

	if (postId) {
		const existingPost = await getPostById(postId);

		if (!existingPost) {
			return res.status(404).json({ error: 'errorPostIsNotExist' });
		}
	}

	if (authorId === '' || postId === '') {
		return res.status(405).json({ error: 'errorInvalidData' });
	}

	try {
		const comments = await db.comment.findMany({
			where: {
				postId,
				authorId
			}
		});

		if (!comments || !comments.length) {
			return res.status(404).json({ message: 'errorCommentIsNotExist' });
		}

		return res.status(200).json({ message: 'successComment', comments });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'errorComment' });
	}
};

const deleteById = async (req, res) => {
	const { commentId } = req.params;

	const existingComment = await getCommentById(commentId);

	if (!existingComment) {
		return res.status(404).json({ error: 'errorCommentIsNotExist' });
	}

	try {
		const deletedComment = await db.comment.delete({
			where: {
				id: commentId
			}
		});

		return res.status(200).json({ message: 'successCommentDeleted' });
	} catch (error) {
		return res.status(500).json({ error: 'errorCommentDelete' });
	}
};

const deleteMany = async (req, res) => {
	const { authorId, postId } = req.query;

	if (postId) {
		const existingPost = await getPostById(postId);

		if (!existingPost) {
			return res.status(404).json({ error: 'errorPostIsNotExist' });
		}
	}

	if (authorId === '' || postId === '') {
		return res.status(405).json({ error: 'errorInvalidData' });
	}

	try {
		const deletedComments = await db.comment.deleteMany({
			where: {
				postId,
				authorId
			}
		});

		if (!deletedComments || !deletedComments.length) {
			return res.status(404).json({ error: 'errorCommentIsNotExist' });
		}

		return res.status(200).json({ message: 'successCommentDeleted' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: 'errorCommentDelete' });
	}
};

module.exports = { getCommentMany, deleteMany, createComment, deleteById, updateCommentById };

