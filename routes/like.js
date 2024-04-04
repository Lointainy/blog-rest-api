const express = require('express');

const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const { like, getLikeManyByPostId } = require('../controllers/likeController');

const router = express.Router();

router.get('/:postId', getLikeManyByPostId);
router.post('/:postId', [authMiddleware], like);

module.exports = router;

