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

module.exports = router;

