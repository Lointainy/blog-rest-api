const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const { createPost, getPostDetailsById, updatePost, deletePost, getPosts } = require('../controllers/postContoller');

const router = express.Router();

router.post('/', [authMiddleware, roleMiddleware], createPost);
router.get('/:id', getPostDetailsById);
router.put('/:id', [authMiddleware, roleMiddleware], updatePost);
router.delete('/:id', [authMiddleware, roleMiddleware], deletePost);
router.get('/', getPosts);

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post.
 *     description: Create a new post with the provided data.
 *     tags:
 *       - Post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/post'
 *     responses:
 *       '201':
 *         description: A new post was created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the newly created post.
 *                 success:
 *                   type: string
 *                   description: A success message indicating the post was created.
 *       '405':
 *         description: Bad request - Invalid post data.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by ID.
 *     description: Retrieve a post by its ID.
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to retrieve.
 *     responses:
 *       '200':
 *         description: The post was retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/post'
 *       '404':
 *         description: Not found - Post with the provided ID does not exist.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post by ID.
 *     description: Update a post by its ID with the provided data.
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/post'
 *     responses:
 *       '200':
 *         description: The post was updated successfully.
 *       '405':
 *         description: Bad request - Invalid post data.
 *       '404':
 *         description: Not found - Post with the provided ID does not exist.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post by ID.
 *     description: Delete a post by its ID.
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to delete.
 *     responses:
 *       '200':
 *         description: The post was deleted successfully.
 *       '404':
 *         description: Not found - Post with the provided ID does not exist.
 *       '500':
 *         description: Server error.
 */

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get a list of posts.
 *     description: Retrieve a list of posts based on search criteria.
 *     tags:
 *       - Post
 *     responses:
 *       '200':
 *         description: A list of posts was retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   description: A success message indicating the posts were retrieved.
 *                 totalCount:
 *                   type: integer
 *                   description: The total number of posts matching the search criteria.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages based on the limit.
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number.
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/post'
 *       '404':
 *         description: Not found - No posts found based on the search criteria.
 *       '500':
 *         description: Server error.
 */

module.exports = router;

