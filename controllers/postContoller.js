const db = require('../prisma');
const z = require('zod');

const { postValidation } = require('../schemas');
const { getPostById } = require('../data/post');

const createPost = async (req, res) => {
	const newPost = req.body;
	const user = req.user;

	if (!newPost) {
		return res.status(400).json({ error: 'errorEmptyPost' });
	}

	try {
		const validateData = postValidation.postSchema.parse(newPost);

		const newCreatedPost = await db.post.create({
			data: {
				...newPost,
				authorId: user.id,
				authorName: user.name
			},
			select: {
				id: true
			}
		});

		return res.status(201).json({ id: newCreatedPost.id, success: 'successPostCreated' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorPostCreate' });
	}
};

const updatePost = async (req, res) => {
	const { id } = req.params;
	const updatedPost = req.body;

	if (!updatedPost) {
		return res.status(400).json({ error: 'errorEmptyPost' });
	}

	const existingPost = await getPostById(id);

	if (!existingPost) {
		return res.status(400).json({ error: 'errorPostIsNotExist' });
	}

	try {
		const validateData = postValidation.partialPostSchema.parseAsync(updatedPost);

		await db.post.update({
			where: {
				id
			},
			data: {
				...updatedPost
			}
		});

		return res.status(201).json({ success: 'successPostUpdated' });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ error: 'errorInvalidData', details: error.errors });
		}
		return res.status(500).json({ error: 'errorPostUpdated' });
	}
};

const deletePost = async (req, res) => {
	const { id } = req.params;

	const existingPost = await getPostById(id);

	if (!existingPost) {
		return res.status(400).json({ error: 'errorPostIsNotExist' });
	}

	try {
		const deletedPost = await db.post.delete({
			where: {
				id
			}
		});

		if (!deletedPost) {
			return res.status(400).json({ error: 'errorPostIsNotExist' });
		}

		return res.status(200).json({ message: 'successPostDeleted' });
	} catch (error) {
		return res.status(500).json({ error: 'errorPostDelete' });
	}
};

const getPostDetailsById = async (req, res) => {
	const { id } = req.params;

	try {
		const existingPost = await getPostById(id);

		if (!existingPost) {
			return res.status(400).json({ error: 'errorPostIsNotExist' });
		}

		return res.status(200).json({ message: 'successPost', post: existingPost });
	} catch (error) {
		return res.status(500).json({ error: 'errorPost' });
	}
};

const getPosts = async (req, res) => {
	const { search, page = 1, limit = 10, authorId } = req.query;

	let postLimit = limit;
	let currentPage = page;
	const maxPostPerPage = 50;

	postLimit = parseInt(limit);
	currentPage = parseInt(page);

	if (isNaN(postLimit) || isNaN(currentPage)) {
		postLimit = 10;
		currentPage = 1;
	}

	if (postLimit > maxPostPerPage) postLimit = maxPostPerPage;

	try {
		let posts = [],
			totalCount = 0;
		const skip = (currentPage - 1) * postLimit;

		if (search) {
			totalCount = await db.post.count({
				where: {
					OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }],
					authorId
				}
			});

			posts = await db.post.findMany({
				where: {
					OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }],
					authorId
				},
				take: postLimit,
				skip,
				orderBy: {
					createdAt: 'desc'
				}
			});
		} else {
			posts = await db.post.findMany({
				where: {
					authorId
				},
				take: postLimit,
				skip,
				orderBy: { createdAt: 'desc' }
			});

			totalCount = await db.post.count({
				where: {
					authorId
				}
			});
		}

		if (!posts || !posts.length || totalCount === 0) {
			return res.status(404).json({ error: 'errorNoPostsFound' });
		}

		const totalPages = Math.ceil(totalCount / postLimit);

		return res.status(200).json({
			success: 'successPosts',
			totalCount,
			totalPages,
			currentPage,
			posts
		});
	} catch (error) {
		return res.status(500).json({ error: 'errorPosts' });
	}
};

module.exports = { createPost, getPostDetailsById, updatePost, deletePost, getPosts };

