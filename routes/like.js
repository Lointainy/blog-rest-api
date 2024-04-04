const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const { addLike, removeLike } = require('../controllers/likeController');

const router = express.Router();

router.post('/:postId', [authMiddleware], addLike);
router.delete('/:id', [authMiddleware], removeLike);

module.exports = router;

