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
 * /comment:
 *   get:
 *     summary: Get comments based on query parameters.
 *     description: Retrieve comments based on search criteria.
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: Optional. The ID of the comment author.
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: Optional. The ID of the post to retrieve comments for.
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
 *         description: Not found - No comments found based on the search criteria.
 *       '405':
 *         description: Invalid data - Missing or invalid query parameters.
 *       '500':
 *         description: Server error.
 *
 *   delete:
 *     summary: Delete multiple comments based on query parameters.
 *     description: Delete multiple comments based on search criteria.
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: Optional. The ID of the comment author.
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: Optional. The ID of the post to delete comments for.
 *     responses:
 *       '200':
 *         description: Comments deleted successfully.
 *       '404':
 *         description: Not found - No comments found based on the search criteria or missing parameters.
 *       '405':
 *         description: Invalid data - Missing or invalid query parameters.
 *       '500':
 *         description: Server error.
 *
 * /comment/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID.
 *     description: Delete a comment by its ID.
 *     tags:
 *       - Comment
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
 *
 * /comment/{postId}:
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

module.exports = router;

