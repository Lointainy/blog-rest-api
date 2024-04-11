const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const { getCommentMany, deleteMany, createComment, deleteById, updateCommentById } = require('../controllers/commetController');

const router = express.Router();

router.post('/:postId', [authMiddleware], createComment);
router.put('/:commentId', [authMiddleware], updateCommentById);
router.get('/', getCommentMany);
router.delete('/', [authMiddleware, roleMiddleware], deleteMany);
router.delete('/:commentId', [authMiddleware], deleteById);

/**
 * @swagger
 * /comment/{postId}:
 *   post:
 *     summary: Create a new comment for a post.
 *     description: Create a new comment for the specified post.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to comment on.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/comment'
 *     responses:
 *       '201':
 *         description: A new comment was created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/comment'
 *       '400':
 *         description: Bad request - Invalid or missing data.
 *       '404':
 *         description: Not found - Post with the provided ID does not exist.
 *       '405':
 *         description: Method not allowed - Empty comment data.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /comment/{commentId}:
 *   put:
 *     summary: Update a comment by ID.
 *     description: Update a comment with the provided data.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/comment'
 *     responses:
 *       '201':
 *         description: The comment was updated successfully.
 *       '400':
 *         description: Bad request - Invalid or missing data.
 *       '404':
 *         description: Not found - Comment with the provided ID does not exist.
 *       '405':
 *         description: Method not allowed - Comment update time limit exceeded.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Get a list of comments.
 *     description: Retrieve a list of comments based on search criteria.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: The ID of the comment author.
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: The ID of the post for which to retrieve comments.
 *     responses:
 *       '200':
 *         description: A list of comments was retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating the comments were retrieved.
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/comment'
 *       '404':
 *         description: Not found - No comments found based on the search criteria.
 *       '405':
 *         description: Method not allowed - Invalid data provided.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /comment:
 *   delete:
 *     summary: Delete multiple comments.
 *     description: Delete multiple comments based on search criteria.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: The ID of the comment author.
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: The ID of the post for which to delete comments.
 *     responses:
 *       '200':
 *         description: The comments were deleted successfully.
 *       '404':
 *         description: Not found - No comments found based on the search criteria.
 *       '405':
 *         description: Method not allowed - Invalid data provided.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /comment/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID.
 *     description: Delete a comment by its ID.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to delete.
 *     responses:
 *       '200':
 *         description: The comment was deleted successfully.
 *       '404':
 *         description: Not found - Comment with the provided ID does not exist.
 *       '500':
 *         description: Server error.
 */

module.exports = router;

