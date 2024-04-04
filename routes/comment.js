const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const { createComment, deleteComment, deleteComments } = require('../controllers/commetController');

const router = express.Router();

router.post('/:postId', [authMiddleware, roleMiddleware], createComment);
router.delete('/:id', [authMiddleware], deleteComment);
router.delete('/all/:postId', [authMiddleware, roleMiddleware], deleteComments);

module.exports = router;

