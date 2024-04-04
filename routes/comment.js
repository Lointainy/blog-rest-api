const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const { createComment, deleteComment, deleteCommentMany, getCommentManyByPostId } = require('../controllers/commetController');

const router = express.Router();

router.get('/:postId', getCommentManyByPostId);
router.post('/:postId', [authMiddleware], createComment);
router.delete('/:id', [authMiddleware], deleteComment);
router.delete('/all/:postId', [authMiddleware, roleMiddleware], deleteCommentMany);

module.exports = router;

