const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const { like, getLikeMany } = require('../controllers/likeController');

const router = express.Router();

router.get('/', getLikeMany);
router.post('/:postId', [authMiddleware], like);

/**
 * @swagger
 * /like/{postId}:
 *   post:
 *     summary: Like a post.
 *     description: Like a post with the provided post ID.
 *     tags:
 *       - Like
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to like.
 *     responses:
 *       '201':
 *         description: The post was liked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: A success message indicating the post was liked.
 *       '400':
 *         description: Bad request - Invalid post ID or post does not exist.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /like:
 *   get:
 *     summary: Get likes for a post.
 *     description: Retrieve likes for a post based on post ID.
 *     tags:
 *       - Like
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve likes for.
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: (Optional) Filter likes by author ID.
 *     responses:
 *       '200':
 *         description: Likes retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: A success message indicating likes were retrieved.
 *                 likes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/like'
 *       '404':
 *         description: Bad request - Likes is not exist.
 *       '500':
 *         description: Server error.
 */

module.exports = router;

