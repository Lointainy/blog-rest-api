const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const { createComment, deleteComment, deleteCommentMany, getCommentManyByPostId } = require('../controllers/commetController');

const router = express.Router();

router.get('/:postId', getCommentManyByPostId);
router.post('/:postId', [authMiddleware], createComment);
router.delete('/:id', [authMiddleware], deleteComment);
router.delete('/all/:postId', [authMiddleware, roleMiddleware], deleteCommentMany);

/**
 * @swagger
 * /comment/{postId}:
 *   get:
 *     summary: Get comments by post ID.
 *     description: Retrieve comments for a post based on post ID.
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to retrieve comments for.
 *     responses:
 *       '200':
 *         description: Comments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating comments were retrieved.
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/comment'
 *       '404':
 *         description: Not found - Post with the provided ID does not exist or no comments found.
 *       '500':
 *         description: Server error.
 *
 *   post:
 *     summary: Create a new comment for a post.
 *     description: Create a new comment for a post with the provided post ID.
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to create a comment for.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/comment'
 *     responses:
 *       '201':
 *         description: The comment was created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/comment'
 *                 success:
 *                   type: string
 *                   description: A success message indicating the comment was created.
 *       '404':
 *         description: Not found - Post with the provided ID does not exist.
 *       '405':
 *         description: Bad request - Invalid or empty comment data.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment by ID.
 *     description: Delete a comment by its ID.
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
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

/**
 * @swagger
 * /comment/all/{postId}:
 *   delete:
 *     summary: Delete all comments for a post.
 *     description: Delete all comments associated with the provided post ID.
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to delete comments for.
 *     responses:
 *       '200':
 *         description: All comments for the post were deleted successfully.
 *       '404':
 *         description: Not found - Post with the provided ID does not exist or no comments to delete.
 *       '500':
 *         description: Server error.
 */

module.exports = router;

